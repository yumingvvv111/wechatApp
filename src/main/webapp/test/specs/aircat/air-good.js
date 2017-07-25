describe('Air good page', function() {

    it('should have the right title - the fancy generator way', function() {
        browser.url('/p2/src/main/webapp/dist/');
        var title = browser.getTitle();
        expect(title).toBe('P6');
    });

});
