(function() {
    function SongPlayer() {
        var SongPlayer = {};
        
//        @desc Current song object set to null when page loads
//        @type {Object}
        var currentSong = null;
        
//        @desc Buzz object audio file
//        @type {Object}
        var currentBuzzObject = null;
        
//        @function setSong
//        @desc Stops the currentl song and loads a new audio file as currentBuzzObject
//        @param {Object} song
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
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
            if (currentSong !== song) {
                setSong(song);
                playSong(song);
                
            } else if (currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        
//        @function SongPlayer.pause(song)
//        @desc Pauses a song at its current time
//        @param {Object} song
        SongPlayer.pause = function(song) {
            pauseSong(song);
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();