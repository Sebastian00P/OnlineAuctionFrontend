import {Component, EventEmitter, Inject, Injectable, Injector, OnInit, Output,} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {AppComponentBase} from '@shared/app-component-base';
import {AuctionDto} from '@shared/service-proxies/service-proxies';
import {AuctionResourceService} from '@app/auctions/create-user/auction-resource.service';

@Component({
    templateUrl: './create-auction-dialog.component.html',
})
export class CreateAuctionDialogComponent
    extends AppComponentBase
    implements OnInit {
    saving = false;
    auction = new AuctionDto({description: '---'});

    isEdit = false;

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        public _auctionsService: AuctionResourceService,
        public bsModalRef: BsModalRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isEdit = !!this.bsModalRef.content.auction && Object.keys(this.bsModalRef.content.auction).length > 1;
        }, 100);
    }

    save(): void {
        this.saving = true;
        const request = this.isEdit ?
            this._auctionsService.update(this.auction) :
            this._auctionsService.create(this.auction);

        request.subscribe(
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
