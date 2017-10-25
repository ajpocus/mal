function zip(pairList) {
  if (pairList.length % 2 !== 0) {
    let errorMsg = 'Error: The list provided to zip must have an even number of elements';
    console.log(errorMsg);
    throw new Error(errorMsg);
  }

  let obj = {};
  for (let i = 0; i < pairList.length; i += 2) {
    obj[pairList[i]] = pairList[i + 1];
  }

  return obj;
}

exports = module.exports = { zip };
