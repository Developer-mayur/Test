export let generatetoken = async (req, res)=>{
    return Math.random()
    .toString(36).slice(2) + Date.now()
    .toString(36) + Math.random()
    .toString(36).
    toString(36);

}