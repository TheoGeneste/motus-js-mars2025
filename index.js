document.addEventListener('DOMContentLoaded', function () {
    // const tu instancie une variable que tu ne veux pas modifier
    // let tu instancie une variable que tu veux modifier

    // Récupérer les elements du DOM (HTML)
    const gameWon = document.getElementById('gameWon');
    const gameLoose = document.getElementById('gameLoose');
    const average = document.getElementById('average');
    const averageTry = document.getElementById('averageTry');
    const remainingTry = document.getElementById('remainingTry');
    const grid = document.getElementById('grid');
    const letters = document.getElementsByClassName('letters')

    // Const pour le nombre d'essais
    const maxTry = 6;

    // Const pour les mots à deviner
    const mots = ["arbre", "maison", "chat", "chien", "soleil", "lune", "eau", "feu", "terre", "air",
        "livre", "école", "voiture", "route", "ville", "montagne", "rivière", "forêt", "fleur", "jardin",
        "porte", "fenêtre", "ordinateur", "table", "chaise", "lampe", "plume", "papier", "stylo", "sac",
        "musique", "chanson", "film", "photo", "ami", "famille", "temps", "jour", "nuit", "étoile"];



    // Tableau à double dimension pour stocker les cases
    let gridArray = [];

    // Je stocke la ligne sur laquelle je suis
    let currentLine = 0;
    // Je stocke la colonne sur laquelle je suis
    let currentColumn = 1;
    // Je stocke le mot à deviner
    let randomWord = "";
    // Je stocke le mot rentrer par l'utilisateur
    let userWord = [];
    // Je stocke le les lettre bien placées 
    let goodLetter = [];

    // Equivalent 
    // if (localStorage.getItem('gameWon')) {
    //     gameWon.innerHTML = localStorage.getItem('gameWon');
    // }else{
    //     gameWon.innerHTML = 0;
    // }
    // LocalStorage est un objet qui permet de stocker des données dans le navigateur
    gameWon.innerHTML = localStorage.getItem('gameWon') ? localStorage.getItem('gameWon') : 0;
    gameLoose.innerHTML = localStorage.getItem('gameLoose') ? localStorage.getItem('gameLoose') : 0;
    let totalTry = localStorage.getItem('totalTry') ? localStorage.getItem('totalTry') : 0;

    updateAverageTry();
    updateAverage();
    play();

    for (let lett of letters) {
        lett.addEventListener('click', function (event) {
            let letter = event.target.innerHTML.toUpperCase();

            switch (letter) {
                case "ENTRER":
                    checkWord();
                    break;
                case "SUPPR":
                    removeCharacter();
                    break;

                default:
                    addCharacter(letter);
                    break;
            }
        });
    }

    // Equivalent à au dessus
    // for (let index = 0; index < letters.length; index++) {
    //     letters[index].addEventListener('click', function (event) {

    //     });
    // }

    document.addEventListener('keydown', function (event) {
        // Récuperer la touche pressée
        const letter = event.key.toUpperCase();

        // Vérifier que la touche est egale à quelque chose

        switch (letter) {
            case "ENTER":
                checkWord();
                break;

            case "BACKSPACE":
                removeCharacter();
                break;
            case "ESCAPE":
                // Réinitialiser le jeu
                play();
                break;
            default:

                addCharacter(letter);

                break;
        }

    });

    function play() {
        // Je vide le tableau
        grid.innerHTML = "";
        // Je réinitialise le tableau qui stocke les cases
        gridArray = [];
        // Je réinitialise la ligne
        currentLine = 0;
        // Je réinitialise la colonne
        currentColumn = 1;
        // Je réinitialise le nombre d'essais restants
        remainingTry.innerHTML = maxTry;
        // Aller chercher un mot au hasard dans le tableau
        randomWord = supprimerCaracteresSpeciaux(mots[Math.floor(Math.random() * mots.length)]).toUpperCase();

        // Je vide le tableau goodLetter
        goodLetter = [];
        // Je parcours une bloucle pour le nombre d'essais défini
        // Ligne
        for (let index = 0; index < maxTry; index++) {
            // Je crée une ligne dans le tableau
            const row = document.createElement('tr');
            // Je crée un tableau pour stocker les cellules de la ligne
            gridArray[index] = [];
            // Je parcours une boucle pour le nombre de lettres du mot
            // Colonne
            for (let j = 0; j < randomWord.length; j++) {
                // Je crée une cellule dans la ligne
                const cell = document.createElement('td');
                // Je vérifie que je suis sur la première ligne et la première colonne
                if (index == 0 && j == 0) {
                    cell.innerHTML = randomWord.charAt(j).toUpperCase();
                    // Je met la lettre en majuscule dans mon tableau
                    userWord[j] = randomWord.charAt(j).toUpperCase();
                }
                // J'ajoute ma cellule au tableau gridArray en postion [index][j] 
                // Index correspond à la ligne et j à la colonne
                gridArray[index][j] = cell;
                // J'ajoure la cellule à la ligne
                row.appendChild(cell);
            }
            // J'ajoute la ligne au tableau
            grid.appendChild(row);
        }

        // Je met la case de la ou je vais écrire en gris
        gridArray[currentLine][currentColumn].style.backgroundColor = "darkgray";
    }

    // Je supprime les accents et les caractères spéciaux pour les remplacer par des lettres normales
    // Exemple : "é" devient "e", "è" devient "e", "ê" devient "e", "ë" devient "e", "ç" devient "c"
    function supprimerCaracteresSpeciaux(chaine) {
        return chaine.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Je met à jour le taux de réussite en %
    function updateAverage() {
        // Je vérifie que gameLoose ou gameWon ne sont pas à 0 pour éviter la division par 0
        if (gameLoose.innerHTML != 0 || gameWon.innerHTML != 0) {
            localStorage.setItem('average', (parseInt(gameWon.innerHTML) * 100 / (parseInt(gameLoose.innerHTML) + parseInt(gameWon.innerHTML))).toFixed(2));
            average.innerHTML = localStorage.getItem('average') ? localStorage.getItem('average') + "%" : 0;
        } else {
            localStorage.setItem('average', 0);
            average.innerHTML = localStorage.getItem('average') ? localStorage.getItem('average') + "%" : 0;
        }
    }

    // Je met à jour le nombre d'essais moyen
    function updateAverageTry() {
        // Je vérifie que gameLoose ou gameWon ne sont pas à 0 pour éviter la division par 0
        if (gameLoose.innerHTML != 0 || gameWon.innerHTML != 0) {
            localStorage.setItem('averageTry', (parseInt(totalTry) / (parseInt(gameLoose.innerHTML) + parseInt(gameWon.innerHTML))).toFixed(2));
            averageTry.innerHTML = localStorage.getItem('averageTry') ? localStorage.getItem('averageTry') : 0;
        } else {
            localStorage.setItem('averageTry', 0);
            averageTry.innerHTML = localStorage.getItem('averageTry') ? localStorage.getItem('averageTry') : 0;
        }
    }

    function addCharacter(letter) {
        // Vérifier que la touche est une lettre 
        if (/^[a-zA-Z]$/.test(letter) && gridArray[currentLine][currentColumn] != undefined) {
            gridArray[currentLine][currentColumn].innerHTML = letter.toUpperCase();
            // Je met la lettre en majuscule dans mon tableau
            userWord[currentColumn] = letter.toUpperCase();
            // Je vérifie que je ne suis pas à la fin de la ligne
            if (currentColumn <= randomWord.length - 1) {
                // Je remet la case ou je suis en noir
                gridArray[currentLine][currentColumn].style.backgroundColor = "black";
                // J'incrémente la colonne
                currentColumn++;
                // Je met la case ou je vais écrire en gris
                if (gridArray[currentLine][currentColumn] != undefined) {
                    gridArray[currentLine][currentColumn].style.backgroundColor = "darkgray";
                }
            }
        }
    }

    function removeCharacter() {
        // Je vérifie que je ne suis pas à la première colonne
        if (currentColumn > 0) {
            // Je vérifie que je ne suis pas à la première colonne
            if (gridArray[currentLine][currentColumn] != undefined) {
                gridArray[currentLine][currentColumn].style.backgroundColor = "black";
            }
            if (currentColumn > 1) {
                // Je décrémente la colonne
                currentColumn--;
            }
            // Je vide la case
            gridArray[currentLine][currentColumn].innerHTML = "";
            gridArray[currentLine][currentColumn].style.backgroundColor = "darkgray";

        }
    }

    function checkWord() {
        // Je vérifie que je suis à la fin de la ligne  
        if (currentColumn === randomWord.length) {
            // Je crée un tableau d'object tempon pour stocker les lettres du mot avec la quantité de fois qu'elles apparaissent
            let tempWord = [];

            // Je parcours le mot à rentrer par l'utilisateur
            for (let index = 0; index < randomWord.length; index++) {
                // Je vérifie que la lettre n'est pas déjà dans le tableau
                if (tempWord[randomWord[index]] == undefined) {
                    // Je l'ajoute au tableau
                    tempWord[randomWord[index]] = 1;
                } else {
                    // Je l'incrémente
                    tempWord[randomWord[index]]++;
                }
            }


            // Je parcours le mot de l'utilisateur pour vérifier les lettres bien placées
            for (let index = 0; index < userWord.length; index++) {
                // Si la lettre est bien placée et qu'elle est encore dans le tableau tempWord 
                if (userWord[index] == randomWord.charAt(index) && tempWord[userWord[index]] > 0) {
                    // Je met la case en rouge
                    gridArray[currentLine][index].style.backgroundColor = "red";
                    // Je décrémente le nombre de fois que la lettre apparaît
                    tempWord[userWord[index]]--;
                    // Stocker la lettre dans le tableau goodLetter
                    goodLetter[index] = userWord[index];

                    for (lett of letters) {
                        // Je vérifie que la lettre est bien placée et qu'elle est encore dans le tableau goodLetter
                        if (lett.innerHTML.toUpperCase() == userWord[index]) {
                            lett.style.backgroundColor = "red";
                        }
                    }

                }
            }

            // Je parcours le mot de l'utilisateur pour vérifier les lettres mal placées
            for (let index = 0; index < userWord.length; index++) {
                // Si la lettre est mal placée et qu'elle est encore dans le tableau tempWord
                if (randomWord.includes(userWord[index]) && tempWord[userWord[index]] > 0 && userWord[index] != randomWord.charAt(index)) {
                    // Je met la case en jaune
                    gridArray[currentLine][index].style.backgroundColor = "darkorange";
                    // Je décrémente le nombre de fois que la lettre apparaît
                    tempWord[userWord[index]]--;
                    for (lett of letters) {
                        // Je vérifie que la lettre est bien placée et qu'elle est encore dans le tableau goodLetter
                        if (lett.innerHTML.toUpperCase() == userWord[index]) {
                            lett.style.backgroundColor = "darkorange";
                        }
                    }
                    // Sinon si la lettre n'est pas dans le mot à deviner ou qu'elle est déjà bien placée ou 
                    // que sa quantité dans le tableau tempWord est à 0
                } else if (userWord[index] != randomWord.charAt(index)) {
                    // Je met la case en gris
                    gridArray[currentLine][index].style.backgroundColor = "grey";
                    for (lett of letters) {
                        // Je vérifie que la lettre est bien placée et qu'elle est encore dans le tableau goodLetter
                        if (lett.innerHTML.toUpperCase() == userWord[index] && lett.style.backgroundColor != "red" && lett.style.backgroundColor != "darkorange") {
                            lett.style.backgroundColor = "grey";
                        }
                    }
                }
            }


            // J'incrémente la ligne
            currentLine++;
            // Incrémenter le nombre total d'essais
            totalTry = parseInt(totalTry) + 1;
            localStorage.setItem('totalTry', totalTry);

            // Je parcours le tableau goodLetter pour mettre les lettres bien placées dans la ligne en dessous
            for (let index = 0; index < goodLetter.length; index++) {
                // Je vérifie que la lettre est bien placée et qu'elle est encore dans le tableau goodLetter
                if (goodLetter[index] != undefined && gridArray[currentLine] != undefined) {
                    // Je met la lettre dans la case correspondante
                    gridArray[currentLine][index].innerHTML = goodLetter[index].toUpperCase();
                }

            }

            // Mettre à jour le nombre d'essais restants
            remainingTry.innerHTML = parseInt(remainingTry.innerHTML) - 1;
            // Je réinitialise la colonne
            currentColumn = 1;
            // Je vérifie que le mot est correct
            if (userWord.join("") == randomWord) {
                setTimeout(() => {
                    // Je met à jour le nombre de victoires
                    gameWon.innerHTML = parseInt(gameWon.innerHTML) + 1;
                    localStorage.setItem('gameWon', gameWon.innerHTML);
                    // Je met à jour average
                    updateAverage();
                    updateAverageTry();
                    alert("Vous avez gagné ! Le mot était " + randomWord);
                    // Je réinitialise le jeu
                    play();
                }, 100);
            }
            // Je vérifie que je ne suis pas à la fin du tableau
            if (currentLine == maxTry) {
                // retarde de 100ms pour que l'alerte s'affiche après la dernière lettre
                setTimeout(() => {
                    // Je met à jour le nombre de défaites
                    gameLoose.innerHTML = parseInt(gameLoose.innerHTML) + 1;
                    localStorage.setItem('gameLoose', gameLoose.innerHTML);
                    // Je met à jour average
                    updateAverage();
                    updateAverageTry();
                    alert("Vous avez perdu ! Le mot était " + randomWord);
                    play();
                }, 100);
            } else {
                // Je vide le tableau userWord
                userWord = [];
                // J'ajoute la première lettre du mot à deviner dans le tableau userWord
                userWord.push(randomWord.charAt(0).toUpperCase());
                gridArray[currentLine][0].innerHTML = randomWord.charAt(0).toUpperCase();
                gridArray[currentLine][currentColumn].style.backgroundColor = "darkgray";
            }
        }
    }
});