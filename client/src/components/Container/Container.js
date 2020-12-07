import React from 'react'
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';

export const Containers = props => {

    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    }

    return (
        <Container style={styles.container}>
            <Card style={{ padding: '5%', marginTop: '5%', marginBottom: '5%', width: '60%' }}>
                {props.children}
            </Card>
        </Container>
    );
}