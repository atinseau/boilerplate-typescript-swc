import puppeteer from 'puppeteer';
import { insertWord, searchWord, updateWord } from '../model/word';
let browser = null;
const getProperties = async (data, property)=>{
    let all = [];
    await Promise.all(data.map(async (e)=>{
        all.push(await (await e.getProperty(property)).jsonValue());
    }));
    return all;
};
const getAllIds = async (synos = [])=>{
    const ids = [];
    for (const syno of synos){
        let word = await searchWord(syno);
        if (!word) word = await insertWord(syno);
        ids.push(word.id);
    }
    return ids;
};
const alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
];
export const injectSynonym = async ()=>{
    if (!browser) browser = await puppeteer.launch();
    let dict = await browser.newPage();
    await dict.goto('http://www.synonymo.fr/dictionnaire_des_synonymes');
    const body = await dict.$$("body .fiche-wrapper .fiche ul li a");
    let letters = await getProperties(body, 'href');
    for(let i = 0; i < letters.length; i++){
        if (i >= alphabet.indexOf('v')) {
            await dict.goto(letters[i]);
            const wordsDom = await dict.$$("body .fiche-wrapper .fiche ul li a");
            let wordsHref = await getProperties(wordsDom, 'href');
            let wordsText = await getProperties(wordsDom, 'textContent');
            for(let e = 0; e < wordsHref.length; e++){
                let word = await searchWord(wordsText[e]);
                if (!word) word = await insertWord(wordsText[e]);
                await dict.goto(wordsHref[e]);
                const synosDom = await dict.$$("body .fiche-wrapper .fiche ul li a");
                let synos = await getProperties(synosDom, 'textContent');
                const synoIds = await getAllIds(synos);
                const update = await updateWord(word.id, synoIds);
                if (!update) console.log(alphabet[i] + ", " + e + ": skip");
                else console.log(alphabet[i] + ", " + e + ": new !");
            }
        }
    }
};
