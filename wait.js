const Wait = (time) => new Promise((res) => setTimeout(res, time * 1000));

export default Wait;
