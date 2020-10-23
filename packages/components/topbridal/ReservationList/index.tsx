import { RefreshControl } from 'react-native';
import { FlatList, View } from 'react-native-ui';
import React, { PureComponent } from 'react';

import ListPlaceHolder from '../ListPlaceholder';
import ReservationItem from '../ReservationItem';
import { booksList } from 'actions/book';
import { dispatch } from 'febrest';

interface Props {
	tab: number;
	storeId: string;
	autoSearch?: boolean;
}
//预约列表(tab:1-今日预约 2-明日预约 3-全部 默认为1)
export default class ReservationList extends PureComponent<Props> {
	state = {
		data: [],
		isLoading: false,
		page: 1,
		total: 0,
		pageSize: 15,
		keyword: '',
		book_sn: '',
		visit: '',
		come: '',
		flag: '',
		start_wedding_date: '',
		end_wedding_date: '',
		start_visit_date: '',
		end_visit_date: '',
		refreshing: false,
	};
	componentDidMount() {
		const { autoSearch = true } = this.props;
		autoSearch && this._booksList();
	}
	search(keyword: string, ext?: any) {
		this.state.data = [];
		this.state.page = 1;
		this.state.keyword = keyword;
		if (ext) {
			this.state = {
				...this.state,
				...ext,
			};
		}
		this._booksList();
	}
	refresh() {
		this.state.data = [];
		this.state.page = 1;
		this._booksList();
	}
	render() {
		const { data } = this.state;
		return (
			<FlatList
				showsVerticalScrollIndicator={false}
				style={{ height: '100%' }}
				data={data}
				alwaysBounceVertical={true}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this._onRefresh}
					/>
				}
				keyExtractor={this._keyExtractor}
				renderItem={this._renderItem}
				ListEmptyComponent={ListPlaceHolder}
				ListFooterComponent={<View style={{ height: 60 }}></View>}
				onEndReached={this._onEndReached}
				onEndReachedThreshold={0.2}
			/>
		);
	}
	private _keyExtractor(item: any, index: number) {
		return index + '';
	}
	private _renderItem = ({ item, index }: { item: any; index: number }) => {
		return <ReservationItem data={item} />;
	};
	private _booksList() {
		const { tab, storeId } = this.props;
		const {
			page,
			pageSize,
			keyword,
			book_sn,
			visit,
			come,
			flag,
			start_wedding_date,
			end_wedding_date,
			start_visit_date,
			end_visit_date,
		} = this.state;
		dispatch(booksList, {
			tab,
			page,
			pageSize,
			store_id: storeId,
			book_sn,
			visit,
			come,
			flag,
			start_wedding_date,
			end_wedding_date,
			start_visit_date,
			end_visit_date,
			keyword,
		}).then((d: any) => {
			let { data, ...state } = this.state;
			data = data.concat(d.data || []);
			this.setState({
				...state,
				data,
				total: d.total,
				isLoading: false,
				refreshing: false,
			});
		});
	}
	private _onEndReached = () => {
		this._loadMore();
	};
	private _loadMore() {
		const { isLoading } = this.state;
		if (isLoading) {
			return;
		}
		if (this.state.data.length >= this.state.total) {
			return;
		}
		this.state.page++;
		this._booksList();
	}
	private _onRefresh = () => {
		this.setState({ refreshing: true });
		this.refresh();
	};
}
