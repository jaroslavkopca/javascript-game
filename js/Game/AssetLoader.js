export default class AssetLoader {
    static assets = [
        // Images
        'http://127.0.0.1:5501/textures/arrow.svg',
        'http://127.0.0.1:5501/textures/background7.svg',
        'http://127.0.0.1:5501/textures/bigmom.svg',
        'http://127.0.0.1:5501/textures/bow.svg',
        'http://127.0.0.1:5501/textures/buggy.svg',
        'http://127.0.0.1:5501/textures/chest.svg',
        'http://127.0.0.1:5501/textures/chopper.svg',
        'http://127.0.0.1:5501/textures/coin.svg',
        'http://127.0.0.1:5501/textures/exp.svg',
        'http://127.0.0.1:5501/textures/fist.svg',
        'http://127.0.0.1:5501/textures/flamingo.svg',
        'http://127.0.0.1:5501/textures/house.svg',
        'http://127.0.0.1:5501/textures/katakuri.svg',
        'http://127.0.0.1:5501/textures/knife.svg',
        'http://127.0.0.1:5501/textures/kuma.svg',
        'http://127.0.0.1:5501/textures/player.svg',
        'http://127.0.0.1:5501/textures/shuriken.svg',
        // 'http://127.0.0.1:5501/textures/pixel_characters_one_piece_collection_by_ollmart_dd113nu-375w-2x.jpg',

        // Fonts
        // { type: 'font', name: 'Joystix', src: 'http://127.0.0.1:5501/fonts/joystix monospace.otf' },
        { type: 'font', name: 'OptimusPrinceps', src: 'http://127.0.0.1:5501/fonts/OptimusPrinceps.ttf' },
        { type: 'font', name: 'OptimusPrincepsSemiBold', src: 'http://127.0.0.1:5501/fonts/OptimusPrincepsSemiBold.ttf' },
        { type: 'font', name: 'SuperPixel', src: 'http://127.0.0.1:5501/fonts/SuperPixel-m2L8j.ttf' },

        // Audio
        'http://127.0.0.1:5501/js/Audio/background_music.mp3',
        'http://127.0.0.1:5501/js/Audio/dead_sound.mp3',
        'http://127.0.0.1:5501/js/Audio/hit_sound.mp3',
        'http://127.0.0.1:5501/js/Audio/shoot_sound.mp3',
        'http://127.0.0.1:5501/js/Audio/win_sound.mp3'
    ];

    // Function to load an image and return a Promise
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = (error) => reject({ type: 'image', src, error });
        });
    }

    // Function to load a font and return a Promise
    static loadFont(name, src) {
        return new Promise((resolve, reject) => {
            const font = new FontFace(name, `url(${src})`);
            font.load().then(() => {
                document.fonts.add(font);
                resolve(src);
            }).catch(error => reject({ type: 'font', name, src, error }));
        });
    }

    // Function to load an audio file and return a Promise
    static loadAudio(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = src;
            audio.onloadeddata = () => resolve(src);
            audio.onerror = (error) => reject({ type: 'audio', src, error });
        });
    }

    // Function to load assets and return a Promise
    static loadAssets() {
        let loadedAssets = 0;

        const updateProgress = (callback) => {
            const progress = (loadedAssets / AssetLoader.assets.length) * 100;
            callback(progress);
        };

        return new Promise((resolve, reject) => {
            AssetLoader.assets.forEach(asset => {
                let loadPromise;
                if (typeof asset === 'string') {
                    if (asset.endsWith('.svg') || asset.endsWith('.jpg') || asset.endsWith('.png')) {
                        loadPromise = AssetLoader.loadImage(asset);
                    } else if (asset.endsWith('.mp3')) {
                        loadPromise = AssetLoader.loadAudio(asset);
                    }
                } else if (asset.type === 'font') {
                    loadPromise = AssetLoader.loadFont(asset.name, asset.src);
                }

                loadPromise.then(() => {
                    loadedAssets++;
                    updateProgress((progress) => {
                        const progressBar = document.getElementById('progressBarFill');
                        if (progressBar) {
                            progressBar.style.width = `${progress}%`;
                        }
                    });
                    if (loadedAssets === AssetLoader.assets.length) {
                        resolve();
                    }
                }).catch(error => {
                    console.error(`Error loading asset:`, error);
                    reject(error);
                });
            });
        });
    }
}
