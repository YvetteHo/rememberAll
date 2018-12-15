import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Drawer, List, WhiteSpace } from 'antd-mobile-rn';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default class MyDrawer extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }

    }

    onOpenChange = () => {
        this.setState({
            isOpen: true
            })
    };

    render() {
        const sidebar = (
            <ScrollView style={[styles.container]}>
                <Text>你是狗吧</Text>
            </ScrollView>
        );

        return (
            <Drawer
                sidebar={sidebar}
                position="left"
                open={true}
                // drawerRef={(el: any) => (this.drawer = el)}
                onOpenChange={this.onOpenChange}
                drawerBackgroundColor="#ccc"
            />
        );
    }
}