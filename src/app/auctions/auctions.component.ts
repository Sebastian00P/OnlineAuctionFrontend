import {Component, Injector} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {AuctionDto} from '@shared/service-proxies/service-proxies';
import {CreateAuctionDialogComponent} from './create-user/create-auction-dialog.component';
import {AuctionResourceService} from '@app/auctions/create-user/auction-resource.service';
import structuredClone from '@ungap/structured-clone';


class PagedAuctionsRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './auctions.component.html',
  animations: [appModuleAnimation()],
})
export class AuctionsComponent extends PagedListingComponentBase<AuctionDto> {
  auctions: AuctionDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _auctionService: AuctionResourceService,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  createAuction(): void {
    this.showCreateOrEditUserDialog();
  }

  editAuction(auction: AuctionDto): void {
    this.showCreateOrEditUserDialog(auction.id);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedAuctionsRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {

    this._auctionService.getAll().pipe(finalize(() => finishedCallback())).subscribe((auctions) => {
        this.auctions = auctions.result;
        this.showPaging({
            items: auctions.result,
            totalCount: auctions.result.length,
        }, pageNumber);
      });
  }

  protected delete(auction: AuctionDto): void {
    abp.message.confirm(
      'Are you sure you want to delete auction \'' + auction.title + '\'?  This cannot be undone.',
      undefined,
      (result: boolean) => {
        if (result) {
          this._auctionService.delete(auction.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      },
    );
  }

  private async showCreateOrEditUserDialog(id?: number) {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateAuctionDialogComponent,
        {
          class: 'modal-lg',
        },
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        CreateAuctionDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            auction: structuredClone(this.auctions.find(x => x.id === id)),
          },
        },
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
