import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import data from '..\\src\\bib.json';

let count = 1;

class BibList extends React.Component {
	render() {
		return (
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Nom</th>
						<th>Adresse</th>
						<th>Telephone</th>
            <th>Experience</th>
					</tr>
				</thead>
				{data.map(restaurant => (
					<tbody>
						<tr>
							<td>{count++}</td>
							<td>{restaurant.name}</td>
							<td>{restaurant.adresse}</td>
							<td style={{'width': 160}}>{restaurant.numTel}</td>
							<td>{restaurant.experience}</td>
						</tr>
					</tbody>
				))}
			</Table>
		);
	}
}



 export default BibList;
