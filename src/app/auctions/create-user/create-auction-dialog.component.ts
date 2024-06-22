import {Component, EventEmitter, Injector, OnInit, Output,} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {AppComponentBase} from '@shared/app-component-base';
import {AuctionDto} from '@shared/service-proxies/service-proxies';
import {AuctionService} from '@app/auctions/create-user/auction.service';

@Component({
  templateUrl: './create-auction-dialog.component.html',
})
export class CreateAuctionDialogComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  auction = new AuctionDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _auctionsService: AuctionService,
    public bsModalRef: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;

    this._auctionsService.create(this.auction).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
}
