import web3 from 'web3';

export const toWei = (val) => web3.utils.toWei(val, 'ether');
export const toEther = (val) => web3.utils.fromWei(val, 'ether');