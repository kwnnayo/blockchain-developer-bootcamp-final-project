export const getReasonMessage = (response) => {
  let reason = response.message.match(new RegExp('"reason":' + '(.*)' + '},')); //unfortunately works only for ganache
  return reason !== null ? reason[1] : null;

};