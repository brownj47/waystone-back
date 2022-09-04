const friends = [0,1,2,7,8,9]
const users = [0,1,2,3,4,5,6,7,8,9]

const randUserFetch = () => {
	const randUser = Math.floor(Math.random()*10)
	return randUser
}

//returns all users not in outbox
const filterFriendsFromUsers = (users, friends) => {
	return users.filter(user => !friends.includes(user))
};

//given one user, returns true if request sent, false if not
const randUserFriendCheck = (friends) => {
	let randUser = randUserFetch()
		if (!friends.includes(randUser)){
		return randUser
		} else {
			return randUserFriendCheck(friends)
		}
	}
	
console.log(filterFriendsFromUsers(users,friends))