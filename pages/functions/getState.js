export const getState = (state) =>
    state === '0' ?
        'In Progress'
        : state === '1'
            ? 'Goal reached'
            : 'Goal reached and owner got paid'