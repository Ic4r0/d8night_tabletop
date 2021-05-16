import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

interface Sections {
  icon: string;
  name: string;
  section: string;
}

@Component({
  selector: 'app-section-change-modal',
  templateUrl: './section-change-modal.component.html',
  styleUrls: ['./section-change-modal.component.scss']
})
export class SectionChangeModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;
  sections: Sections[] = [];
  defaultSections: Sections[] = [
    {
      icon: 'sections/general',
      name: 'Characteristics, Saves, Combat modifiers, Proficiencies, Languages, Skills',
      section: 'general'
    },
    {
      icon: 'sections/actions',
      name: 'Actions',
      section: 'actions'
    },
    {
      icon: 'sections/spells',
      name: 'Spells',
      section: 'spells'
    },
    {
      icon: 'sections/equip',
      name: 'Equipment',
      section: 'equipment'
    },
    {
      icon: 'sections/feats',
      name: 'Feats and traits',
      section: 'featsAndTraits'
    },
    {
      icon: 'sections/description',
      name: 'Description',
      section: 'description'
    },
    {
      icon: 'sections/extras',
      name: 'Extras',
      section: 'extras'
    }
  ];
  mobileSections: Sections[] = [
    {
      icon: 'sections/general',
      name: 'Characteristics, Saves, Combat modifiers, Proficiencies, Languages',
      section: 'general'
    },
    {
      icon: 'sections/skills',
      name: 'Skills',
      section: 'skills'
    },
    {
      icon: 'sections/actions',
      name: 'Actions',
      section: 'actions'
    },
    {
      icon: 'sections/spells',
      name: 'Spells',
      section: 'spells'
    },
    {
      icon: 'sections/equip',
      name: 'Equipment',
      section: 'equipment'
    },
    {
      icon: 'sections/feats',
      name: 'Feats and traits',
      section: 'featsAndTraits'
    },
    {
      icon: 'sections/description',
      name: 'Description',
      section: 'description'
    },
    {
      icon: 'sections/extras',
      name: 'Extras',
      section: 'extras'
    }
  ];

  @Input() set mobile(value: boolean) {
    this.sections = value ?
      [...this.mobileSections] :
      [...this.defaultSections];
  }
  @Output() section: EventEmitter<string> = new EventEmitter();

  constructor() { }

  changeSection(selectedSection: string) {
    this.section.emit(selectedSection);
  }

  public show() {
    this.modal.show();
  }

  public hide() {
    this.modal.hide();
  }
}
