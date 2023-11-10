export function makeStringsFirstCharacterBig(name){
    let splittingTheName = name.split(" ");
    let outputContainerArray = [];

    for(let i = 0; i < splittingTheName.length; i++){
        let splittingWord = splittingTheName[i].split("");
        let newWord = [];

        for(let p = 0; p < splittingWord.length; p++){
            if(!isNaN(Number(splittingWord[p]))){
                newWord.push(splittingWord[p])
            } else {
                if(p === 0){
                    newWord.push(splittingWord[p].toUpperCase());
                } else {
                    newWord.push(splittingWord[p].toLowerCase());
                }
            }
        }

        outputContainerArray.push(newWord.join(""));
    }

    return outputContainerArray.join(" ");
};

console.time("basit fonksiyon hızı");
makeStringsFirstCharacterBig("bAhçelievLer Mahallesi, 1806 sokAK, Aslanboğa aPaRtManı, Kat 1 no: 2");
console.timeEnd("basit fonksiyon hızı");

export const makeStringsFirstCharacterBigEs6 = name => name.split(" ").map(word => !isNaN(Number(word)) ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");

console.time("es6 fonksiyon hızı");
makeStringsFirstCharacterBig("bAhçelievLer Mahallesi, 1806 sokAK, Aslanboğa aPaRtManı, Kat 1 no: 2")
console.timeEnd("es6 fonksiyon hızı");

// garib bir şekilde es6 fonksiyonu çok çok daha hızlı. Niye Bilmiyorum.