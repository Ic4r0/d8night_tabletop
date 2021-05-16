import { Component, Input, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ClassSpellByLevel, Spell } from 'src/app/shared/models/spell/spell.model';

@Component({
  selector: 'app-prepare-spells-modal',
  templateUrl: './prepare-spells-modal.component.html',
  styleUrls: ['./prepare-spells-modal.component.scss']
})
export class PrepareSpellsModalComponent {
  @ViewChild('modal', { static: true }) modal: ModalComponent;

  @Input() campaign: string;
  @Input() sheet: string;
  @Input() className = '';
  @Input() set spells(value: ClassSpellByLevel[]) {
    if (!!value) {
      this.spellsList = [...value];
      this.spellsListFiltered = [...value];
      this.initPreparedArray();
    }
  }
  @Input() full: {className: string, level: ClassSpellByLevel[]}[] = [];

  spellsList: ClassSpellByLevel[] = [];
  spellsListFiltered: ClassSpellByLevel[] = [];
  prepared: ClassSpellByLevel[] = [];
  preparedNameList: string[] = [];
  castableSpellByLevel: {[level: number]: number} = {};
  completeNameList: {[spellName: string]: boolean} = {};

  searchFilter: string;

  loadingModal = false;

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  initPreparedArray() {
    this.prepared = this.spellsList.map((singleLevel) => ({
      info: {
        ...singleLevel.info,
        casted: 0
      },
      spell: []
    }));
    this.preparedNameList = [];
    this.castableSpellByLevel = {};
    this.completeNameList = {};
    for (const singleLevel of this.spellsList) {
      this.castableSpellByLevel[singleLevel.info.number] = singleLevel.info.cast;
      singleLevel.spell.forEach(({name}) => {
        this.completeNameList[name] = false;
      });
    }
  }

  reset() {
    this.spellsListFiltered = !!this.searchFilter ?
      this.spellsList.map((level) => ({
        ...level,
        spell: level.spell.filter(({name}) =>
          name.toLowerCase().includes(this.searchFilter.toLowerCase())
        )
      })) : [...this.spellsList];
    this.initPreparedArray();
  }

  filterSpells(inputSearch: any) {
    this.searchFilter = (inputSearch.target as HTMLInputElement).value;
    this.spellsListFiltered = this.spellsList.map((level) => ({
      ...level,
      spell: level.spell.filter(({name}) =>
        name.toLowerCase().includes(this.searchFilter.toLowerCase())
      )
    }));
  }

  submit() {
    this.loadingModal = true;
    const selectedClassIdx = this.full.findIndex(({className}) => className === this.className);
    const newPreparedSpells: {className: string, level: ClassSpellByLevel[]}[] = [...this.full];
    if (selectedClassIdx > -1) {
      newPreparedSpells.splice(selectedClassIdx, 1, {className: this.className, level: this.prepared});
    } else {
      newPreparedSpells.push({className: this.className, level: this.prepared});
    }
    this.loadingModal = true;
    this.sheetService.updateSheetProperty(
      this.campaign,
      this.sheet,
      {spells: {prepared: {class: newPreparedSpells}}},
      ['spells.prepared.class'],
      [newPreparedSpells]
    ).pipe(
      first(),
      tap(() => {
        this.modal.hide();
        this.loadingModal = false;
      }),
      catchError((err) => {
        this.loadingModal = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }

  addSpell(spell: Spell, spellLevel: number) {
    if (!this.isFullPrepared()) {
      for (const [idx, singleLevel] of this.prepared.entries()) {
        const validLevel = spellLevel >= singleLevel.info.number;
        const emptySlot = singleLevel.info.cast > singleLevel.spell.length;
        const lastLevel = this.prepared.length === idx + 1;
        if (validLevel && emptySlot) {
          this.prepared[idx].spell.push(spell);
          this.preparedNameList.push(spell.name);
          break;
        } else if (lastLevel) {
          this.toastr.warning(`You have no more free slots for ${spell.name}`, 'Warning');
        }
      }
    } else {
      this.toastr.warning('You have no more free slots', 'Warning');
    }
  }

  removeSpell(spell: Spell, spellLevel: number) {
    if (this.preparedNameList.includes(spell.name)) {
      for (const [idx, singleLevel] of this.prepared.entries()) {
        const validLevel = spellLevel >= singleLevel.info.number;
        if (validLevel) {
          const spellIdx = this.prepared[idx].spell.findIndex(({name}) => name === spell.name);
          if (spellIdx > -1) {
            const newPreparedSpellsList = [...this.prepared[idx].spell];
            newPreparedSpellsList.splice(spellIdx, 1);
            this.prepared[idx].spell = [...newPreparedSpellsList];
            const textIdx = this.preparedNameList.findIndex((name) => name === spell.name);
            this.preparedNameList.splice(textIdx, 1);
            break;
          }
        }
      }
    } else {
      this.toastr.warning('You can\'t remove a spell that you have not prepared', 'Warning');
    }
  }

  isFullPrepared(): boolean {
    for (const singleLevel of this.prepared) {
      if (singleLevel.spell.length !== singleLevel.info.cast) {
        return false;
      }
    }
    return true;
  }

  public show() {
    this.modal.show();
  }
}
