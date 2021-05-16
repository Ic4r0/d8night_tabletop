import { Component, Input, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ClassSpellAttributes, ClassSpellByLevel, Spell, SpellsList } from 'src/app/shared/models/spell/spell.model';
import { PrepareSpellsModalComponent } from '../../modals/prepare-spells-modal/prepare-spells-modal.component';
import { SpellDetailsModalComponent } from '../../modals/spell-details-modal/spell-details-modal.component';

@Component({
  selector: 'app-spells',
  templateUrl: './spells.component.html',
  styleUrls: ['./spells.component.scss']
})
export class SpellsComponent {
  @ViewChild('prepareSpellsModal', {static: true}) prepareSpellsModal: PrepareSpellsModalComponent;
  @ViewChild('spellDetailsModal', {static: true}) spellDetailsModal: SpellDetailsModalComponent;

  spellsList: SpellsList;
  racialSpells: Spell[] = [];
  racialSpellsFiltered: Spell[] = [];
  innateClassSpells: Spell[] = [];
  innateClassSpellsFiltered: Spell[] = [];
  classesNames: string[] = ['NA'];
  classSpellsAttributes: {[className: string]: ClassSpellAttributes} = {};
  classSpellsByLevel: {[className: string]: ClassSpellByLevel[]} = {};
  classSpellsByLevelBackup: {[className: string]: ClassSpellByLevel[]} = {};
  classSpellsByLevelFiltered: {[className: string]: ClassSpellByLevel[]} = {};

  spellSearch: {[className: string]: string} = {};

  selectedSpell: Spell;
  selectedClass: string;
  selectedClassSpells: ClassSpellByLevel[] = [];

  loading = false;

  @Input() mobile = false;
  @Input() tablet = false;
  @Input() campaign: string;
  @Input() sheet: string;
  @Input() set spells(value: SpellsList) {
    if (!!value) {
      this.spellsList = {...value};
      this.racialSpells = [];
      this.innateClassSpells = [];
      if (!!value.innate && !!value.innate.racial) {
        this.racialSpells = [...value.innate.racial];
      }
      if (!!value.innate && !!value.innate.class) {
        this.innateClassSpells = [...value.innate.class];
      }
      this.racialSpellsFiltered = [...this.racialSpells];
      this.innateClassSpellsFiltered = [...this.innateClassSpells];
      this.classSpellsAttributes = {};
      this.classSpellsByLevel = {};
      this.classesNames = ['NA'];
      if (!!value.known) {
        this.classesNames = value.known.class.map(({attributes}) => attributes.className);
        this.classesNames.forEach((className: string) => {
          const classValues = value.known.class.find(({attributes}) => attributes.className === className);
          this.classSpellsAttributes[className] = {...classValues.attributes};
          if (!classValues.attributes.memorize) {
            this.classSpellsByLevel[className] = [...classValues.level];
            this.classSpellsByLevelFiltered[className] = !!this.spellSearch[className] ?
              classValues.level.map((level) => ({
                ...level,
                spell: level.spell.filter(({name}) =>
                  name.toLowerCase().includes(this.spellSearch[className].toLowerCase())
                )
              })) : [...classValues.level];
          } else {
            if (!!value?.prepared && !!value?.prepared.class.find((elem) => elem.className === className)) {
              const spellsPrepared = value?.prepared.class.find((elem) => elem.className === className);
              this.classSpellsByLevel[className] = [...spellsPrepared.level];
              this.classSpellsByLevelBackup[className] = [...spellsPrepared.level];
              this.classSpellsByLevelFiltered[className] = !!this.spellSearch[className] ?
                spellsPrepared.level.map((level) => ({
                  ...level,
                  spell: level.spell.filter(({name}) =>
                    name.toLowerCase().includes(this.spellSearch[className].toLowerCase())
                  )
                })) : [...spellsPrepared.level];
            } else {
              this.classSpellsByLevel[className] = [];
              this.classSpellsByLevelBackup[className] = [];
              this.classSpellsByLevelFiltered[className] = [];
            }
          }
        });
      }
    }
  }

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  onSelectSpell(selectedSpell: Spell) {
    this.selectedSpell = {...selectedSpell};
    this.spellDetailsModal.show();
  }

  filterSpells(inputSearch: any, spellType: string, className?: string) {
    const inputValue = (inputSearch.target as HTMLInputElement).value;
    if (spellType === 'racial') {
      this.racialSpellsFiltered = this.racialSpells.filter(({name}) =>
        name.toLowerCase().includes(inputValue.toLowerCase()));
    } else if (spellType === 'innateClass') {
      this.innateClassSpellsFiltered = this.innateClassSpells.filter(({name}) =>
        name.toLowerCase().includes(inputValue.toLowerCase()));
    } else if (spellType === 'class') {
      this.spellSearch[className] = inputValue;
      this.classSpellsByLevelFiltered[className] = this.classSpellsByLevel[className].map((level) => ({
        ...level,
        spell: level.spell.filter(({name}) => name.toLowerCase().includes(inputValue.toLowerCase()))
      }));
    }
  }

  castSpell(spellName: string, spellLevel: number, selectedClass: string, isMemorized: boolean, casted: number) {
    if (isMemorized) {
      this.loading = true;
      let modifiedSpellsArray = [];
      const spellsByClass = this.spellsList.prepared.class.find(({className}) => className === selectedClass);
      for (const singleLevel of spellsByClass.level) {
        if (singleLevel.info.number === spellLevel) {
          modifiedSpellsArray = [...singleLevel.spell];
          break;
        }
      }
      const spellIdx = modifiedSpellsArray.findIndex(({name}) => name === spellName);
      modifiedSpellsArray.splice(spellIdx, 1);
      const newPreparedSpells = this.spellsList.prepared.class.map((singleClass) => {
        if (singleClass.className === selectedClass) {
          return {
            ...singleClass,
            level: this.classSpellsByLevel[selectedClass].map((singleLevel) => {
              if (singleLevel.info.number === spellLevel) {
                return {
                  info: {
                    ...singleLevel.info,
                    casted: singleLevel.info.casted + 1
                  },
                  spell: modifiedSpellsArray
                };
              } else {
                return singleLevel;
              }
            })
          };
        } else {
          return singleClass;
        }
      });
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {spells: {prepared: {class: newPreparedSpells}}},
        ['spells.prepared.class'],
        [newPreparedSpells]
      ).pipe(
        first(),
        tap(() => {
          this.loading = false;
        }),
        catchError((err) => {
          this.loading = false;
          this.toastr.error(err);
          return of(err);
        })
      ).subscribe();
    } else {
      this.onCheckboxChange(selectedClass, spellLevel, casted + 1);
    }
  }

  prepareSpells(className: string) {
    this.selectedClass = className;
    this.selectedClassSpells = this.spellsList.known.class
      .find(({attributes}) => attributes.className === className)
      .level;
    this.prepareSpellsModal.show();
  }

  resetSpells(className: string) {
    this.loading = true;
    const newPreparedSpells = this.spellsList.prepared.class.map((singleClass) => {
      if (singleClass.className === className) {
        return {
          className,
          level: this.classSpellsByLevelBackup[className]
        };
      } else {
        return singleClass;
      }
    });
    this.sheetService.updateSheetProperty(
      this.campaign,
      this.sheet,
      {spells: {prepared: {class: newPreparedSpells}}},
      ['spells.prepared.class'],
      [newPreparedSpells]
    ).pipe(
      first(),
      tap(() => {
        this.loading = false;
      }),
      catchError((err) => {
        this.loading = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }

  onCheckboxChange(className: string, spellLevel: number, casted: number) {
    this.loading = true;
    const newKnownSpells = this.spellsList.known.class.map((singleClass) => {
      if (singleClass.attributes.className === className) {
        return {
          attributes: singleClass.attributes,
          level: singleClass.level.map((singleLevel) => {
            if (singleLevel.info.number === spellLevel) {
              return {
                info: {
                  ...singleLevel.info,
                  casted
                },
                spell: singleLevel.spell
              };
            } else {
              return singleLevel;
            }
          })
        };
      } else {
        return singleClass;
      }
    });
    this.sheetService.updateSheetProperty(
      this.campaign,
      this.sheet,
      {spells: {known: {class: newKnownSpells}}},
      ['spells.known.class'],
      [newKnownSpells]
    ).pipe(
      first(),
      tap(() => {
        this.loading = false;
      }),
      catchError((err) => {
        this.loading = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }
}
