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

    uploadPhoto() {
        const fileElement = document.getElementById('photo') as HTMLInputElement;
        fileElement.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.auction.photo = reader.result as string;
            };
        };

        fileElement.click();
    }
}
