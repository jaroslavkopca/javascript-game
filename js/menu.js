import main from './main.js';
import { player, camera } from './main.js';
import Game from './Game/Game.js'; 
import AssetLoader from './Game/AssetLoader.js'


$(document).ready(function() {
    $("#game-start").hide();
    $("#game-mainmenu").hide();
    $("#gameCanvas").hide();
    $(".game-upgrademenu").hide(); 
    $(".game-endmenu").hide(); 
    $("#game-settings").hide();

    // Show loading screen at the beginning
    $("#loadingScreen").show();

    AssetLoader.loadAssets()
        .then(() => {
            // console.log("All assets loaded");
            $("#loadingScreen").hide();
            $("#game-start").show();
        })
        .catch((error) => {
            console.error("Error loading assets:", error);
            $("#loadingScreen").hide();
            $("#game-start").show(); // Still show the start button even if there's an error
        });

    // Start button click handler
    $("#startButton").click(function() {
        $("#game-start").hide();
        $("#game-mainmenu").show();
    });

    // Start Game button click handler
    $("#startGameButton").click(function() {
        $("#game-mainmenu").hide();
        $("#gameCanvas").show();
        startGame();
    });

    // Upgrade Menu button click handler
    $("#upgradeMenuButton").click(function() {
        $("#game-start").hide();
        $("#game-mainmenu").hide();
        $(".game-upgrademenu").show(); 
        $("#playerCoins").text(`Coins: ${player.coins}`);
        $("#equippedWeaponImage").attr("src", player.weapon.svgImage.src);
        generateUpgradeItems();
    });

    // Settings button click handler
    $("#settingsButton").click(function() {
        $("#game-start").hide();
        $("#game-mainmenu").hide();
        $("#game-settings").show();
        updateSettingsDisplay();
    });

    // Back to Main Menu button click handler
    $("#backToMainMenuButton").click(function() {
        Game.saveGameState();
        $(".game-upgrademenu").hide(); 
        $("#game-mainmenu").show();
    });

    // Restart Game button click handler
    $("#restartButton").click(function() {
        $(".game-endmenu").hide();
        Game.startNewGame();
    });

    // Pause Game button click handler
    $("#pauseButton").click(function() {
        Game.togglePause();
    });

    // Resume Game button click handler
    $("#resumeButton").click(function() {
        $(".game-endmenu").hide();
        Game.play();
    });

    $("#backToMenuButton").click(function() {
        Game.endGame();
        $(".game-endmenu").hide();
        $("#game-mainmenu").show();
    });

    function startGame() {
        main(); // Assuming this initializes the game
    }

    function generateUpgradeItems() {
        const upgrades = Object.keys(player.upgrades);
    
        // Clear any existing items
        $("#upgradeItemsContainer").empty();
    
        upgrades.forEach(upgradeType => {
            const level = player.upgrades[upgradeType];
            const cost = player.upgradePrices[upgradeType][level - 1];
            const maxLevel = 5;
            const upgradeItem = `
                <div class="upgrade-item" data-upgrade="${upgradeType}">
                    <span>${upgradeType.charAt(0).toUpperCase() + upgradeType.slice(1)} (Level ${level})</span>
                    <span>Cost: ${cost} coins</span>
                    <button class="upgrade-button" ${level >= maxLevel ? 'disabled' : ''}>Upgrade</button>
                </div>
            `;
            $("#upgradeItemsContainer").append(upgradeItem);
        });
    
        // Attach event handlers to dynamically created buttons
        $(".upgrade-button").click(function() {
            const upgradeType = $(this).parent().data("upgrade");
            upgradePlayer(upgradeType);
        });
    }
    
    function upgradePlayer(upgradeType) {
        player.upgrade(upgradeType);
        $("#playerCoins").text(`Coins: ${player.coins}`);
        generateUpgradeItems(); // Refresh the upgrade items to reflect changes
    }
    

    function upgradePlayer(upgradeType) {
        if (player.coins >= 50 && player.upgrades[upgradeType] < 5) {
            player.upgrade(upgradeType);
            $("#playerCoins").text(`Coins: ${player.coins}`);
            generateUpgradeItems(); // Refresh the upgrade items to reflect changes
        }
    }


    // Weapon shop click handler for purchasing
    $(".weapon-item").on("click", function() {
        const weaponType = $(this).data("weapon");
        const weaponPrice = $(this).data("price");
        
        // Check if player can afford the weapon
        if (player.coins >= weaponPrice) {
            if(player.hasWeapon(weaponType)){
                console.log("Weapon already owned.")
                return
            }
            // Deduct coins from player's inventory
            player.coins -= weaponPrice;
            $("#playerCoins").text(`Coins: ${player.coins}`);
    
            // Update inventory
            player.equipWeapon(weaponType);

            // Change status text to "Bought"
            $(this).find(".status").text("Bought");
    
        } else {
            console.log("Not enough coins to buy this weapon.");
        }
    });
    

    // Drag and drop functionality for equipped weapons
    $(".weapon-item").on("dragstart", function(e) {
        const weaponType = $(this).data("weapon");
        e.originalEvent.dataTransfer.setData("weaponType", weaponType);
    });
    
    $(".equipment-slot").on("dragover", function(e) {
        e.preventDefault();
        $(this).addClass("drag-over");
    });

    $(".equipment-slot").on("dragleave", function(e) {
        $(this).removeClass("drag-over");
    });

    $(".equipment-slot").on("drop", function(e) {
        e.preventDefault();
        $(this).removeClass("drag-over");
        
        const weaponType = e.originalEvent.dataTransfer.getData("weaponType");
        

        // Continue with your logic to equip the weapon
        if (player.hasWeapon(weaponType)) {
            player.equipWeapon(weaponType);

            // Optionally, remove from inventory or mark as equipped
            const index = player.inventory.indexOf(weaponType);
            if (index !== -1) {
                player.inventory.splice(index, 1); // Remove from inventory
            }
        } else {
            console.log(`Weapon ${weaponType} is not in the inventory.`);
        }
    });


    // Toggle upgrade menu visibility on click
    $('#upgradeMenuButton').click(function() {
        $('.game-upgrademenu').toggleClass('open');
    });

    // Handle closing upgrade menu and showing main menu on small screens
    $('#backToMainMenuButton').click(function() {
        $('.game-upgrademenu').removeClass('open');
        $('.game-mainmenu').addClass('open');
    });

    // Handle showing and hiding upgrade shop on small screens
    $('.upgrade-item').click(function() {
        $('.upgrade-shop').toggleClass('open');
    });



     // Back to Main Menu from Settings button click handler
     $("#backToMainMenuSettings").click(function() {
        $("#game-settings").hide();
        $("#game-mainmenu").show();
    });

    // Volume slider change handler
    $("#volumeSlider").on("input", function() {
        const volume = $(this).val() / 100;
        Game.audioManager.setVolume(volume);
    });

    // Mute button click handler
    $("#muteButton").click(function() {
        if(Game.audioManager.isMuted){
            Game.audioManager.unmuteAll();
        }else{Game.audioManager.muteAll();}
        updateMuteButton();
    });

    // Add 100 Coins button click handler
    $("#addCoinsButton").click(function() {
        player.coins += 100;
        $("#currentCoinsDisplay").text(player.coins);
    });



    // Function to update settings display based on current state
    function updateSettingsDisplay() {
        $("#volumeSlider").val(Game.audioManager.masterVolume * 100);
        updateMuteButton();
        $("#currentCoinsDisplay").text(player.coins);
    }

    // Function to update mute button text based on current mute state
    function updateMuteButton() {
        const muteButton = document.getElementById('muteButton');
        muteButton.classList.toggle('muted', Game.audioManager.isMuted);
        const muteButtonText = Game.audioManager.isMuted ? "Unmute" : "Mute";
        $("#muteButton").text(muteButtonText);
    }

    // Initial settings update
    updateSettingsDisplay();


    

    // // Window resize event handler to update game viewport
    // $(window).on("resize", function() {
    //     updateGameViewport();
    // });

    // // Function to update game viewport based on window dimensions
    // function updateGameViewport() {
    //     const width = $(window).width();
    //     const height = $(window).height();
        
    //     // Example: Adjusting game canvas dimensions
    //     camera.changeViewport(width,height)
    //     // $("#gameCanvas").width(width);
    //     // $("#gameCanvas").height(height);
        
    //     // Call your game's camera or viewport update function here
    //     // For example, if Game has a function `updateViewport`
    //     // Game.updateViewport(width, height);
    // }
    
});
