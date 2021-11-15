import { deleteWord, getAllWord } from '../model/word';
export const removeWord = async ()=>{
    const words = await getAllWord();
    if (words != null) {
        for (const word of words){
            await deleteWord(word.id);
        }
        console.log("All word cleaned");
    } else {
        console.log("Aleardy empty");
    }
};
