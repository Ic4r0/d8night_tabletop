import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

declare var UIkit: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal', { static: false }) modal: ElementRef;

  @Input() container = true;
  @Input() loading: boolean;
  @Output() closing: EventEmitter<any> = new EventEmitter();

  subscription: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.router.events
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          this.hide();
        }
      });
  }

  ngAfterViewInit(): void {
    UIkit.util.on(this.modal?.nativeElement, 'beforehide', () => this.onClose());
  }

  onClose() {
    this.closing.emit();
  }

  public show() {
    UIkit.modal(this.modal.nativeElement).show();
  }

  public hide() {
    UIkit.modal(this.modal.nativeElement).hide();
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();
  }
}
