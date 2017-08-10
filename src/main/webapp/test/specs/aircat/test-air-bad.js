describe('Air bad page', function() {

    it('should have the right title - the fancy generator way', function() {
        browser.url('/p2/src/main/webapp/dist/#air-bad');
        var title = browser.getTitle();
        expect(title).toBe('p6');
    });

});