module.exports = {
    getError: (errors, prop) => {
    try {
      // error.mapped() === {}
      return errors.mapped()[prop].msg;
    } catch (err) {
      return '';
    }
  }
}