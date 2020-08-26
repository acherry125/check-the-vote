const getTargetValue = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>):string => {
  return e.target.value;
}

export default {
  getTargetValue
}