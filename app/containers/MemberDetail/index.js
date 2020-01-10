import React from 'react'
import {Grid, Segment, List, Button, Statistic, Header} from 'semantic-ui-react'
import { GroupedObservable } from 'rxjs'

export default () => {
  return (
    <Grid centered>
      <Grid.Column computer='14'>
      <Grid>
      <Grid.Row>
        <Grid.Column computer='8'>
          <Header as='h3'> Member Name </Header>
        </Grid.Column>
        <Grid.Column textAlign='right' computer='8'>
          <Button >
            Edit
          </Button>
        </Grid.Column>
      </Grid.Row>
        
      <Grid.Row>
      <Grid.Column computer={8}>      
      <Segment>
        <List divided verticalAlign="middle">
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
         </List>
         <div style={{display: "flex", justifyContent: "flex-end"}}>
         <Statistic horizontal size='mini'>
           <Statistic.Label > Total </Statistic.Label>
           <Statistic.Value text> 999,999</Statistic.Value>
         </Statistic>
         </div>
         
        </Segment> 
      </Grid.Column>
      <Grid.Column computer={8}>
       <Segment>
       <List divided verticalAlign="middle">
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
          <List.Item>
            <List.Content floated="right">50000</List.Content>
            <List.Content>Add Share</List.Content>
          </List.Item>
        </List>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
         <Statistic horizontal size='mini'>
           <Statistic.Label > Total </Statistic.Label>
           <Statistic.Value text> 999,999</Statistic.Value>
         </Statistic>
         </div>
        </Segment>
        </Grid.Column> 
      </Grid.Row>
    </Grid>
      </Grid.Column>
    </Grid>
    
  )
}
