import Game, { IGameModel } from '../models/Game'

import apiService from './apiService'


const [get, getOne] = apiService.constructModelGetters<IGameModel>({
	Model: Game,
	availableSelectOptions: '_id status winner board createdAt modifiedAt index',
	availableSortOptions: 'status winner createdAt modifiedAt',
})


export default {
	get, getOne,
}
