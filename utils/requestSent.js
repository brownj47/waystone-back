

const outbox = [23, 32, 54, 13, 75, 89, 45, 28, 9]

const users = [23, 12, 56, 32, 43, 55, 54, 82, 34, 13, 75, 89, 98, 56, 22, 45, 28, 21, 25, 9]

//returns all users not in outbox
const filterUsersSentRequests = (users, outbox) => {
	return users.filter(user => !outbox.includes(user))
};

//given one user, returns true if request sent, false if not
const requestSentCheck = (user, outbox) => {
	return outbox.includes(user)
}

console.log(filterUsersSentRequests(users, outbox))