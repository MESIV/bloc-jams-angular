(function() {
    function SongPlayer($rootScope, Fixtures) {
        
        var SongPlayer = {};
        var currentAlbum = Fixtures.getAlbum();
        

//        @function getSongIndex
//        @desc Gets the song index in order to manipulate it for the next and previous buttons
//        @param {Object} song
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
            };
        

//        @desc Current song object set to null when page loads
//        @type {Object}
        SongPlayer.currentSong = null;
        
//        @desc Current song time set in seconds
//        @type {Number}        
        SongPlayer.currentTime = null;
        
//        @desc Current song volume set from 0-100 (real quick)
//        @type {Number}
        SongPlayer.volume = 75;
        

//        @desc Buzz object audio file
//        @type {Object}
        var currentBuzzObject = null;
        

//        @function setSong
//        @desc Stops the currentl song and loads a new audio file as currentBuzzObject
//        @param {Object} song
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong();
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                    if (currentBuzzObject.isEnded()) {
                        SongPlayer.next();
                    }
                });
            });
            
            currentSong = song;
        };
        

//        @function playSong
//        @desc Plays a song and sets song.playing to true so album.html changes play/pause icon
//        @param {Object} song
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        }
        
        
//        @function SongPlayer.play(song)
//        @desc Plays a song from the beginning if the song hasn't already started, otherwise it will continue playing the song from where it left off
//        @params {Object} song
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (currentSong !== song) {
                setSong(song);
                playSong(song);
                
            } else if (currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        
        
        var stopSong = function() {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        }
        

//        @function SongPlayer.pause(song)
//        @desc Pauses a song at its current time
//        @param {Object} song
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            pauseSong(song);
        };
        
        
//        @function SongPlayer.previous
//        @desc Moves to the previous song and stops playing music if song == #1
        SongPlayer.previous = function() {
            
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong();
        }       
            else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
        }
    };
        
        
//        @function SongPlayer.next
//        @desc Moves to the next song and stops playing music if it's the last song
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex > Object.keys(currentAlbum).length) {
                stopSong();
        } 
            else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
        }
    }
        
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        }
        
        return SongPlayer;
}
    
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();