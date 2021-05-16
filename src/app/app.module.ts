import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { environment } from '../environments/environment';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import 'hammerjs';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { StoreModule } from './store/store.module';

import UsersManagementResolver from './resolvers/users-management.resolver';
import UsersResolver from './resolvers/users.resolver';
import QuotesResolver from './resolvers/quotes.resolver';
import PlayedCampaignsResolver from './resolvers/played-campaigns.resolver';
import EditCampaignResolver from './resolvers/edit-campaign.resolver';
import SingleCampaignResolver from './resolvers/single-campaign.resolver';
import CampaignsResolver from './resolvers/campaigns.resolver';
import SingleSheetResolver from './resolvers/single-sheet.resolver';

import { SvgComponent } from './shared/svg/svg.component';
import { LoadingOverlayComponent } from './shared/loading-overlay/loading-overlay.component';
import { NavComponent } from './shared/nav/nav.component';
import { ModalComponent } from './shared/modal/modal.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { MobileFooterComponent } from './shared/mobile-footer/mobile-footer.component';
import { MultipleCheckboxesComponent } from './shared/multiple-checkboxes/multiple-checkboxes.component';

import { EditCampaignComponent } from './pages/edit-campaign/edit-campaign.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { LandingComponent } from './pages/landing/landing.component';
import { QuotesManagementComponent } from './pages/quotes-management/quotes-management.component';
import { CampaignsListComponent } from './pages/campaigns-list/campaigns-list.component';
import { SingleCampaignComponent } from './pages/single-campaign/single-campaign.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { SingleSheetComponent } from './pages/single-sheet/single-sheet.component';

import { AdminGuard } from './auth/admin.guard';
import { PlayerGuard } from './auth/player.guard';
import { EditCampaignGuard } from './auth/edit-campaign.guard';
import { CampaignGuard } from './auth/campaign.guard';

import { ActionsComponent } from './pages/single-sheet/sheet-parts/sections/actions/actions.component';
import { SpellsComponent } from './pages/single-sheet/sheet-parts/sections/spells/spells.component';
import { EquipmentComponent } from './pages/single-sheet/sheet-parts/sections/equipment/equipment.component';
import { FeatsTraitsComponent } from './pages/single-sheet/sheet-parts/sections/feats-traits/feats-traits.component';
import { DescriptionsComponent } from './pages/single-sheet/sheet-parts/sections/descriptions/descriptions.component';
import { ExtrasComponent } from './pages/single-sheet/sheet-parts/sections/extras/extras.component';
import { SkillsComponent } from './pages/single-sheet/sheet-parts/sections/skills/skills.component';
import { GeneralComponent } from './pages/single-sheet/sheet-parts/sections/general/general.component';

import { RollModalComponent } from './pages/single-sheet/sheet-parts/modals/roll-modal/roll-modal.component';
import { AbilityScoresModalComponent } from './pages/single-sheet/sheet-parts/modals/ability-scores-modal/ability-scores-modal.component';
import { MovementModalComponent } from './pages/single-sheet/sheet-parts/modals/movement-modal/movement-modal.component';
import { DoubleSectionDescrModalComponent } from './pages/single-sheet/sheet-parts/modals/double-section-descr-modal/double-section-descr-modal.component';
import { SavesModalComponent } from './pages/single-sheet/sheet-parts/modals/saves-modal/saves-modal.component';
import { CombatModifiersModalComponent } from './pages/single-sheet/sheet-parts/modals/combat-modifiers-modal/combat-modifiers-modal.component';
import { HitPointsModalComponent } from './pages/single-sheet/sheet-parts/modals/hit-points-modal/hit-points-modal.component';
import { SingleSkillModalComponent } from './pages/single-sheet/sheet-parts/modals/single-skill-modal/single-skill-modal.component';
import { ArmorClassModalComponent } from './pages/single-sheet/sheet-parts/modals/armor-class-modal/armor-class-modal.component';
import { InitiativeModalComponent } from './pages/single-sheet/sheet-parts/modals/initiative-modal/initiative-modal.component';
import { RestModalComponent } from './pages/single-sheet/sheet-parts/modals/rest-modal/rest-modal.component';
import { ConditionsModalComponent } from './pages/single-sheet/sheet-parts/modals/conditions-modal/conditions-modal.component';
import { SectionChangeModalComponent } from './pages/single-sheet/sheet-parts/modals/section-change-modal/section-change-modal.component';
import { DisplaySkillsModalComponent } from './pages/single-sheet/sheet-parts/modals/display-skills-modal/display-skills-modal.component';
import { MoneyModalComponent } from './pages/single-sheet/sheet-parts/modals/money-modal/money-modal.component';
import { EditEquipModalComponent } from './pages/single-sheet/sheet-parts/modals/edit-equip-modal/edit-equip-modal.component';
import { PrepareSpellsModalComponent } from './pages/single-sheet/sheet-parts/modals/prepare-spells-modal/prepare-spells-modal.component';
import { SpellDetailsModalComponent } from './pages/single-sheet/sheet-parts/modals/spell-details-modal/spell-details-modal.component';
import { SkillModifiersModalComponent } from './pages/single-sheet/sheet-parts/modals/skill-modifiers-modal/skill-modifiers-modal.component';
import { WeaponDetailsModalComponent } from './pages/single-sheet/sheet-parts/modals/weapon-details-modal/weapon-details-modal.component';
import { CompanionsListModalComponent } from './pages/single-sheet/sheet-parts/modals/companions-list-modal/companions-list-modal.component';

import { HoveringButtonsComponent } from './pages/single-sheet/sheet-parts/parts/hovering-buttons/hovering-buttons.component';
import { SheetHeaderComponent } from './pages/single-sheet/sheet-parts/parts/sheet-header/sheet-header.component';
import { MobileFixedInfoComponent } from './pages/single-sheet/sheet-parts/parts/mobile-fixed-info/mobile-fixed-info.component';
import { AbilityGridComponent } from './pages/single-sheet/sheet-parts/parts/ability-grid/ability-grid.component';
import { OverSectionsTabComponent } from './pages/single-sheet/sheet-parts/parts/over-sections-tab/over-sections-tab.component';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.firebaseConfig.authDomain
  },
  position: 'bottom-right',
  theme: 'classic',
  palette: {
    popup: {
      background: '#646464',
      text: '#ffffff',
      link: '#ffffff'
    },
    button: {
      background: '#ff00f1',
      text: '#ffffff',
      border: 'transparent'
    }
  },
  type: 'info',
  content: {
    message: 'This website uses cookies. By using our website the user declares to accept and consent to the use of cookies in accordance with the terms of use of cookies expressed in this document.',
    dismiss: 'Ok!',
    deny: 'Refuse cookies',
    link: 'I want to know more',
    href: '/privacy',
    policy: 'Cookie Policy'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavComponent,
    SvgComponent,
    UsersManagementComponent,
    LoadingOverlayComponent,
    QuotesManagementComponent,
    CampaignsListComponent,
    SingleCampaignComponent,
    EditCampaignComponent,
    ModalComponent,
    BreadcrumbComponent,
    MobileFooterComponent,
    PrivacyComponent,
    CreditsComponent,
    SingleSheetComponent,
    ActionsComponent,
    SpellsComponent,
    EquipmentComponent,
    FeatsTraitsComponent,
    DescriptionsComponent,
    ExtrasComponent,
    RollModalComponent,
    AbilityScoresModalComponent,
    MovementModalComponent,
    DoubleSectionDescrModalComponent,
    SavesModalComponent,
    CombatModifiersModalComponent,
    HitPointsModalComponent,
    SingleSkillModalComponent,
    ArmorClassModalComponent,
    InitiativeModalComponent,
    RestModalComponent,
    ConditionsModalComponent,
    SectionChangeModalComponent,
    MultipleCheckboxesComponent,
    DisplaySkillsModalComponent,
    HoveringButtonsComponent,
    SheetHeaderComponent,
    MobileFixedInfoComponent,
    GeneralComponent,
    AbilityGridComponent,
    OverSectionsTabComponent,
    SkillsComponent,
    MoneyModalComponent,
    EditEquipModalComponent,
    PrepareSpellsModalComponent,
    SpellDetailsModalComponent,
    SkillModifiersModalComponent,
    WeaponDetailsModalComponent,
    CompanionsListModalComponent,
  ],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 4000,
      extendedTimeOut: 4000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      enableHtml: true,
      tapToDismiss: false
    }),
    LayoutModule,
    NgSelectModule,
    ImageCropperModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    StoreModule,
    NgxPaginationModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
  ],
  providers: [
    UsersManagementResolver,
    UsersResolver,
    QuotesResolver,
    PlayedCampaignsResolver,
    EditCampaignResolver,
    SingleCampaignResolver,
    CampaignsResolver,
    SingleSheetResolver,
    AdminGuard,
    PlayerGuard,
    EditCampaignGuard,
    CampaignGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
