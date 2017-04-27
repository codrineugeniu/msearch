describe('msearch', function () {
  beforeEach(angular.mock.module('mSearchApp'));

  var $controller, $httpBackend;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  beforeEach(inject(function(_$httpBackend_){
    $httpBackend = _$httpBackend_;
  }));

  describe('module load', function () {
        it('spotify url should be defined', function () {
            var $scope = {};
            var controller = $controller('MainCtrl', { $scope: $scope });
            expect($scope.search).toBeDefined();
        });

        it('should perform a search', function() {
          var $scope = {};
          var controller = $controller('MainCtrl', { $scope: $scope });
          $scope.terms = 'abba';
          $httpBackend.expectGET('https://api.spotify.com/v1/search?limit=10&offset=0&q=abba&type=album,artist').respond(Promise.resolve([]));
          $scope.search()

          expect($scope.results).toEqual([])
          $httpBackend.flush();

        })
    });
});