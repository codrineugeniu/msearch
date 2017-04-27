'use strict';

module.exports = function($scope, $http, ModalService) {

    $scope.spotifyURL = 'https://api.spotify.com/v1/search';
    var limit = 10;
    var offset = 0;

    var getImageUrl = function(list) {
        return list[0] && list[0].url || ''
    };
    var parseResults = function(data) {
        if (data.albums && data.albums.items) {
            data.albums.items.forEach(function(item) {
                item.imageUrl = getImageUrl(item.images)
            })
        }
        if (data.artists && data.artists.items) {
            data.artists.items.forEach(function(item) {
                item.imageUrl = getImageUrl(item.images)
            })
        }

        return data
    };

    $scope.search = function(append) {
        if (!append) {
            $scope.results = [];
        }

        $http.get($scope.spotifyURL, {
            params: {
                q: $scope.terms,
                type: 'album,artist',
                offset: offset,
                limit: limit
            },
            cache: true
        }).then(function(res) {
            if (append) {
                var parsed = parseResults(res.data)
                if ($scope.results.albums) {
                    $scope.results.albums.items = $scope.results.albums.items.concat(parsed.albums.items)
                }

                if ($scope.results.artists) {
                    $scope.results.artists.items = $scope.results.artists.items.concat(parsed.artists.items)
                }


            } else {
                $scope.results = parseResults(res.data);
            }

        })
    };

    $scope.loadMore = function() {
        offset += limit;
        $scope.search(true);
    };

    $scope.loadDetails = function(type, id, imageUrl, name) {
        var detailsUrl = '';

        if (type === 'artist') {
            detailsUrl = 'https://api.spotify.com/v1/artists/' + id + '/albums?album_type=album';
        } else {
            detailsUrl = 'https://api.spotify.com/v1/albums/' + id;
        }

        $http.get(detailsUrl).then(function(res) {
            var inputs = {
                imageUrl: imageUrl
            }

            if (type === 'artist') {
                inputs.albums = res.data.items
            } else {
                inputs.tracks = res.data.tracks.items
            }

            if (type === 'artist' && inputs.albums.length === 0) {
                return
            }

            ModalService.showModal({
                templateUrl: 'views/modal.html',
                controller: function() {
                    this.imageUrl = imageUrl,
                    this.tracks = inputs.tracks,
                    this.albums = inputs.albums
                    this.name = name,
                    this.dismiss = function() {angular.element(document.querySelectorAll('.modal, .modal-backdrop')).remove()}
                },
                controllerAs: 'ctrl',
                appendElement: angular.element(document.querySelectorAll('.results'))
            }).then(function(modal) {
            });
        })

    };

    $scope.loadArtistDetails = function(id, imageUrl, name) {
        $scope.loadDetails('artist', id, imageUrl, name)
    };

    $scope.loadAlbumDetails = function(id, imageUrl, name) {
        $scope.loadDetails('album', id, imageUrl, name)
    };
};
