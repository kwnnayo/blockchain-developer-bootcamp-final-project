export const getReasonMessage = (response) => {
    let reason = response.message.match(new RegExp("\"reason\":" + "(.*)" + "},"));
    return reason !== null ? reason[1] : response;

}