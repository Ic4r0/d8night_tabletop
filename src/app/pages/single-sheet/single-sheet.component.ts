import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { DiceRollService } from 'src/app/services/dice-roll.service';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { BreadcrumbItems } from 'src/app/shared/models/breadcrumb-items/breadcrumb-items.model';
import { ArmorClass } from 'src/app/shared/models/armor-class/armor-class.model';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { Sheet } from 'src/app/shared/models/sheets/sheets.model';
import { Skill, SkillDisplay } from 'src/app/shared/models/skill/skill.model';
import { AppState } from 'src/app/store/store.model';
import { getCampaignCurrent, getSheetCurrent } from 'src/app/store/store.reducer';
import { HitPoints } from 'src/app/shared/models/hit-points/hit-points.model';
import { Initiative } from 'src/app/shared/models/initiative/initiative.model';
import { AbilityScoresModalComponent } from './sheet-parts/modals/ability-scores-modal/ability-scores-modal.component';
import { DisplaySkillsModalComponent } from './sheet-parts/modals/display-skills-modal/display-skills-modal.component';
import { RollModalComponent } from './sheet-parts/modals/roll-modal/roll-modal.component';
import { MovementModalComponent } from './sheet-parts/modals/movement-modal/movement-modal.component';
import { DoubleSectionDescrModalComponent } from './sheet-parts/modals/double-section-descr-modal/double-section-descr-modal.component';
import { SingleSkillModalComponent } from './sheet-parts/modals/single-skill-modal/single-skill-modal.component';
import { SavesModalComponent } from './sheet-parts/modals/saves-modal/saves-modal.component';
import { CombatModifiersModalComponent } from './sheet-parts/modals/combat-modifiers-modal/combat-modifiers-modal.component';
import { InitiativeModalComponent } from './sheet-parts/modals/initiative-modal/initiative-modal.component';
import { ArmorClassModalComponent } from './sheet-parts/modals/armor-class-modal/armor-class-modal.component';
import { HitPointsModalComponent } from './sheet-parts/modals/hit-points-modal/hit-points-modal.component';
import { RestModalComponent } from './sheet-parts/modals/rest-modal/rest-modal.component';
import { ConditionsModalComponent } from './sheet-parts/modals/conditions-modal/conditions-modal.component';
import { SectionChangeModalComponent } from './sheet-parts/modals/section-change-modal/section-change-modal.component';
import { AbilitiesDisplay } from 'src/app/shared/models/abilities/abilities.model';
import { SavingThrowDisplay } from 'src/app/shared/models/saving-throw/saving-throw.model';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.scss']
})
export class SingleSheetComponent implements OnInit, OnDestroy {
  @ViewChild('displaySkills', {static: true}) displaySkills: DisplaySkillsModalComponent;
  @ViewChild('roll', {static: true}) roll: RollModalComponent;
  @ViewChild('abilityModal', {static: true}) abilityScoresModal: AbilityScoresModalComponent;
  @ViewChild('movements', {static: true}) movements: MovementModalComponent;
  @ViewChild('doubleSectionDescr', {static: true}) doubleSectionDescr: DoubleSectionDescrModalComponent;
  @ViewChild('singleSkill', {static: true}) singleSkill: SingleSkillModalComponent;
  @ViewChild('savesModal', {static: true}) savesModal: SavesModalComponent;
  @ViewChild('combatMods', {static: true}) combatMods: CombatModifiersModalComponent;
  @ViewChild('initiativeModal', {static: true}) initiativeModal: InitiativeModalComponent;
  @ViewChild('acModal', {static: true}) acModal: ArmorClassModalComponent;
  @ViewChild('hpModal', {static: true}) hpModal: HitPointsModalComponent;
  @ViewChild('restModal', {static: true}) restModal: RestModalComponent;
  @ViewChild('conditionsModal', {static: true}) conditionsModal: ConditionsModalComponent;
  @ViewChild('sectionsModal', {static: true}) sectionsModal: SectionChangeModalComponent;

  subs: Subscription[] = [];
  currentCampaign: Campaign = null;
  currentSheet: Sheet = null;
  currentSheetId = '';

  mobileView = false;
  tabletView = false;

  loading = false;
  loadingModal = false;

  breadcrumb: Array<BreadcrumbItems> = [
    { path: '/home', name: 'Home' },
    { path: '/campaigns', name: 'Campaigns' },
  ];

  footerButtons: { icon: string, text: string, label: string, svg?: boolean }[] = [
    { icon: 'conditions', text: 'Conditions', label: 'conditions', svg: true },
    { icon: 'dice', text: 'Roll', label: 'roll', svg: true },
    { icon: 'more-vertical', text: 'Sections', label: 'sections' }
  ];

  selectedSection = 'general';

  // Support variables for info display
  initiative: Initiative = null;
  initiativeValue = '';
  walkMovement = '0';
  maxHp = 0;
  currentHp = 0;
  tempHp = 0;
  newHpValue: number = null;
  hpValue: HitPoints = null;
  ac = 10;
  acValue: ArmorClass = null;
  abilities: {[abilityName: string]: AbilitiesDisplay};
  constitutionValues: { original: number, temp: number } = null;
  saves: {[saveName: string]: SavingThrowDisplay};
  combat: {[combatMod: string]: {total?: number, modifier?: number[], text: string}};
  displayedSkills: string[] = [];
  selectedSkill: Skill;
  skills: SkillDisplay[] = [];
  totalSkills: SkillDisplay[] = [];
  aboveDescription: {title: string, text: string} = {title: '', text: ''};
  belowDescription: {title: string, text: string} = {title: '', text: ''};

  constructor(private titleService: Title,
              private store: Store<AppState>,
              private toastr: CustomToastrService,
              public rollDice: DiceRollService,
              private sheetService: SheetService) {
    this.titleService.setTitle('Sheet - d8 Night');
  }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getSheetCurrent).subscribe(({id, sheet}) => {
        this.currentSheetId = id;
        this.currentSheet = {...sheet};
        this.titleService.setTitle(this.currentSheet.name + ' - d8 Night');
        this.setBreadcrumb();
        this.abilities = SheetService.computeAbilities(this.currentSheet);
        const walk = this.currentSheet.movement.find((item) => item.name.includes('Walk'));
        if (!!walk) {
          this.walkMovement = parseInt(walk.rate, 10).toString();
        }
        [this.initiative, this.initiativeValue] = SheetService.computeInitiative(
          this.currentSheet.initiative,
          this.abilities.Dexterity.modifier
        );
        [this.maxHp, this.currentHp, this.tempHp, this.hpValue] = SheetService.computeHP(
          this.currentSheet.hp,
          this.currentSheet.abilities.Constitution,
          this.currentSheet.level
        );
        [this.acValue, this.ac] = SheetService.computeAC(
          this.currentSheet.ac,
          this.abilities.Dexterity.modifier
        );
        this.saves = SheetService.computeSaves(this.currentSheet, this.abilities);
        this.combat = SheetService.computeCombatModifiers(this.currentSheet.combat.attacks);
        this.displayedSkills = [...this.currentSheet.skills.display];
        this.totalSkills = SheetService.getSkills(
          Object.keys(this.currentSheet.skills.skill),
          this.abilities,
          this.currentSheet.skills.skill
        );
        this.skills = this.totalSkills.filter(({name}) => this.displayedSkills.includes(name));
      }),
      this.store.select(getCampaignCurrent).subscribe((campaign) => {
        this.currentCampaign = {...campaign};
        this.setBreadcrumb();
      })
    );

    this.onResize({target: {innerWidth: window.innerWidth}});
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onResize(event: any) {
    const innerWidth = event.target.innerWidth;
    if (!!innerWidth) {
      this.tabletView = innerWidth >= 640 && innerWidth < 960;
      this.mobileView = innerWidth < 640;
    }
    if (!this.tabletView && !this.mobileView) {
      this.toggleSection('general');
    }
  }

  setBreadcrumb() {
    if (!!this.currentCampaign && !!this.currentSheet) {
      this.breadcrumb = [
        { path: '/home', name: 'Home' },
        { path: '/campaigns', name: 'Campaigns' },
        {
          path: '/campaigns/' + this.currentCampaign?.id,
          name: this.currentCampaign?.name
        },
        {
          path: '',
          name: this.currentSheet?.name
        },
      ];
    }
  }

  selectSkill(skillName: string) {
    this.selectedSkill = SheetService.selectSkill(
      skillName,
      this.currentSheet.skills.skill[skillName],
      this.abilities
    );
    this.singleSkill.show();
  }

  openACModal() {
    this.acModal.show();
  }

  openHPModal() {
    this.constitutionValues = {
      original: this.currentSheet.abilities.Constitution.score,
      temp: this.currentSheet.abilities.Constitution.tempScore
    };
    this.hpModal.show();
  }

  openDoubleSectionDescrModal(section: string) {
    this.aboveDescription = {title: '', text: ''};
    this.belowDescription = {title: '', text: ''};
    if (section === 'defensesSenses') {
      this.aboveDescription = {
        title: 'Defenses',
        text: !!this.currentSheet?.protection?.resistances ?
          this.currentSheet?.protection?.resistances.join(', ') :
          'You have no resistances or immunities'
      };
      this.belowDescription = {
        title: 'Senses',
        text: !!this.currentSheet?.vision ?
          this.currentSheet?.vision :
          'You have no specific senses'
      };
    } else if (section === 'proficienciesLanguages') {
      this.aboveDescription = {
        title: 'Proficiencies',
        text: !!this.currentSheet?.combat?.weapons?.proficiencies ?
          this.currentSheet?.combat?.weapons?.proficiencies :
          'You have no weapon proficiency'
      };
      this.belowDescription = {
        title: 'Languages',
        text: this.currentSheet?.languages
      };
    }
    this.doubleSectionDescr.show();
  }

  onModalChangeHP(value: {isAdded: boolean, hpValue: number}) {
    this.newHpValue = value.hpValue;
    this.changeHP(value.isAdded);
  }

  changeHP(isAdded: boolean) {
    if (!!this.newHpValue && this.newHpValue > 0) {
      let tempHp = this.tempHp;
      let currentHp = this.currentHp;
      if (isAdded) {
        currentHp = Math.min(this.maxHp, currentHp + this.newHpValue);
      } else {
        const suppTemp = tempHp - this.newHpValue;
        tempHp = suppTemp >= 0 ? suppTemp : 0;
        currentHp = suppTemp >= 0 ? currentHp : currentHp + suppTemp;
      }
      this.loading = true;
      this.sheetService.updateSheetProperty(
        this.currentCampaign.id,
        this.currentSheetId,
        {hp: {currentHp, tempHp}},
        ['hp'],
        [{currentHp, tempHp}]
      ).pipe(
        first(),
        tap(() => {
          this.newHpValue = null;
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

  toggleSection(section: string) {
    this.selectedSection = section;
  }

  onSectionChange(section: string) {
    this.toggleSection(section);
    this.sectionsModal.hide();
  }

  onFooterClicked(label: string) {
    if (label === 'roll') {
      this.roll.show();
    } else if (label === 'sections') {
      this.sectionsModal.show();
    } else if (label === 'conditions') {
      this.conditionsModal.show();
    }
  }
}
