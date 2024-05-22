import { OnlineAuctionTemplatePage } from './app.po';

describe('OnlineAuction App', function() {
  let page: OnlineAuctionTemplatePage;

  beforeEach(() => {
    page = new OnlineAuctionTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
