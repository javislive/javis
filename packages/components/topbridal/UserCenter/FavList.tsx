import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui';
import { dispatch, subscribe, unsubscribe } from 'febrest';

import Button from 'components/Button';
import { ORDER_TYPE } from 'utils/topbridal';
import ProductList from 'components/topbridal/ProductList';
import app from 'actions/app';
import { createStyle } from 'themes';
import { resize } from 'utils/resize';
import user from 'actions/user';

interface State {
  isMenuShow: boolean;
}
interface Props {
  data: any[];
}

export default class FavList extends PureComponent<Props> {
  state: State = {
    isMenuShow: false
  };
  componentDidMount() {
    subscribe(this._favChange);
  }

  componentWillUnmount() {
    unsubscribe(this._favChange);
  }
  render() {
    const { isMenuShow } = this.state;
    const { data } = this.props;

    return (
      <View style={styles.wrapper}>
        <ProductList data={data} style={styles.list} hasFavorite={true} />
        <View style={styles.footer}>
          {isMenuShow ? (
            <View style={styles.menu}>
              <TouchableOpacity
                onPress={() => this._toMakeOrder(ORDER_TYPE.TRY)}
              >
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>试纱</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._toMakeOrder(ORDER_TYPE.COUTURE)}
              >
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>定制</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._toMakeOrder(ORDER_TYPE.SELL)}
              >
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>销售</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._toMakeOrder(ORDER_TYPE.RENT)}
              >
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>租赁</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          <Button
            title="下单"
            onPress={this._showMenu}
            size="lg"
            type="active"
          />
        </View>
      </View>
    );
  }
  private _toMakeOrder(orderType: number) {
    this._showMenu();
    dispatch(app.navigate, {
      routeName: 'OrderEdit',
      params: {
        orderType
      }
    });
  }
  private _list() {
    dispatch(user.favorites, null);
  }
  private _favChange = ({ cmd, data }: { cmd: string; data: any }) => {
    if (cmd === 'user.fav') {
      this._list();
    }
  };
  private _showMenu = () => {
    this.setState({
      isMenuShow: !this.state.isMenuShow
    });
  };
}

const styles = createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      paddingVertical: resize(14)
    },
    list: {
      flex: 1
    },
    menu: {
      position: 'absolute',
      bottom: 0,
      paddingBottom: resize(34),
      width: resize(212),
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: resize(20),
      paddingHorizontal: resize(22)
    },
    menuItem: {
      height: resize(39),
      borderColor: theme.borderColor,
      borderTopWidth: theme.px,
      borderBottomWidth: theme.px,
      justifyContent: 'center',
      alignItems: 'center'
    },
    menuItemTop: {
      height: resize(43)
    },
    menuItemText: {
      color: '#282828',
      fontSize: resize(14)
    },
    footer: {
      alignItems: 'center'
    }
  };
});
