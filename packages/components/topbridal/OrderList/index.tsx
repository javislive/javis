import React, { PureComponent } from 'react';

import { RefreshControl } from 'react-native';
import { FlatList, View } from 'react-native-ui';
import { dispatch } from 'febrest';
import common from 'actions/common';
import ListPlaceHolder from '../ListPlaceholder';
import OrderListItem from '../OrderListItem';
import omitNil from 'utils/omitNil';

interface Props {
	params?: any;
}

export default class OrderList extends PureComponent {
	constructor(props: Props) {
		super(props);
		this.state = {
			data: [],
			params: props.params,
			page: 1,
			page_size: 15,
			total_page: 1,
			isLoading: false,
			refreshing: false,
		};
	}

	componentDidMount() {
		this._getData();
	}

	UNSAFE_componentWillReceiveProps(nextProps: any) {
		if (
			JSON.stringify(nextProps.params) !== JSON.stringify(this.state.params)
		) {
			this.setState(
				{
					data: [],
					params: nextProps.params,
					page: 1,
					page_size: 15,
					total_page: 1,
					isLoading: false,
				},
				() => {
					this._getData();
				}
			);
		}
	}
	refresh() {
		this.setState(
			{
				data: [],
				page: 1,
				page_size: 15,
				total_page: 1,
				isLoading: false,
			},
			() => {
				this._getData();
			}
		);
	}
	private _getData = () => {
		const { params, page, page_size } = this.state;
		const requestParams = { ...params, page, page_size };
		dispatch(common.orderList, omitNil(requestParams)).then((res: any) => {
			const { data = [] } = this.state;
			this.setState({
				data: data.concat(res.data),
				total_page: Math.ceil(res.total / res.page_size) || 1,
				refreshing: false,
			});
		});
	};

	private _onEndReached = () => {
		this._loadMore();
	};

	private _loadMore = () => {
		const { isLoading, page, total_page } = this.state;
		if (isLoading || page >= total_page) {
			return;
		}
		this.state.page++;
		this._getData();
	};

	render() {
		const { data } = this.state;
		return (
			<FlatList
				style={{ height: '100%' }}
				data={data}
				keyExtractor={this._keyExtractor}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this._onRefresh}
					/>
				}
				renderItem={this._renderItem}
				ListEmptyComponent={ListPlaceHolder}
				onEndReached={this._onEndReached}
				ListFooterComponent={<View style={{ height: 60 }}></View>}
				showsVerticalScrollIndicator={false}
				onEndReachedThreshold={0.2}
				alwaysBounceVertical={true}
			/>
		);
	}
	private _keyExtractor(item: any, index: number) {
		return index + '';
	}
	private _renderItem = ({ item }: { item: any }) => {
		return <OrderListItem data={item} />;
	};
	private _onRefresh = () => {
		this.setState({ refreshing: true });
		this.refresh();
	};
}
