import {Inject, Injectable, Optional} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_BASE_URL, AuctionDto,} from '@shared/service-proxies/service-proxies';

@Injectable()
export class AuctionResourceService {
    private baseUrl: string;

    constructor(
        private http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string,
    ) {
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '';
    }

    create(input: AuctionDto) {
        return this.http.post(
            this.baseUrl + '/api/services/app/Auction/Create',
            input,
        );
    }

    getAll() {
        return this.http.get<{
            result: AuctionDto[];
        }>(
            this.baseUrl + '/api/services/app/Auction/GetAll',
        );
    }

    delete(id: number) {
        return this.http.delete(
            this.baseUrl + '/api/services/app/Auction/Delete',
            {
                params: {
                    input: id + '',
                },
            },
        );
    }

    update(auction: AuctionDto) {
        return this.http.put(
            this.baseUrl + '/api/services/app/Auction/Update',
            auction,
        );
    }
}
