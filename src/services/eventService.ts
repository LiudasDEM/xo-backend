import Event, { IEventModel } from '../models/Event'

import apiService from './apiService'


const [get, getOne] = apiService.constructModelGetters<IEventModel>({
	Model: Event,
	availableSelectOptions: '_id action player row column modifiedAt createdAt index game',
	availableSortOptions: 'action player createdAt modifiedAt row column',
})


export default {
	get, getOne,
}
