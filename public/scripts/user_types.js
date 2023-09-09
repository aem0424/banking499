class UserAccount {
  constructor(firstName, lastName, username, password, address, phoneNumber, cellNumber, socialSecurity, accounts) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password; // This should definitely be hashed when stored/checked
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.cellNUmber = cellNumber;
    this.socialSecurity = socialSecurity;
    this.accounts = accounts; // This will probably be a list or something
  }

  // Method
  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getUsername() {
    return this.username;
  }

  getAddress() {
    return this.address;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  getCellNumber() {
    return this.cellNumber;
  }

  getSocialSecurity() {
    return this.socialSecurity;
  }

  getFullName() {
    return this.firstName + " " + this.lastName;
  }
}

class Customer extends UserAccount {
}

class Teller extends UserAccount {
}

class Administrator extends UserAccount {
}