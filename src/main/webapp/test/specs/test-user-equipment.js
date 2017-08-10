describe('User Equipment Page', function() {

    it('should have the right title', function() {
        browser.url('?code=135#user-equipment');
        var title = browser.getTitle();
        expect(title).toBe('设备列表');
    });

});
