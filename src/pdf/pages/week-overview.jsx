import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import {
	DATE_FORMAT as SPECIAL_DATES_DATE_FORMAT,
	findByDate,
	HOLIDAY_DAY_TYPE,
} from 'configuration-form/special-dates';
import { getWeekNumber } from 'lib/date';
import Header from 'pdf/components/header';
import MiniCalendar, { HIGHLIGHT_WEEK } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';
import { weekOverviewLink, dayPageLink } from 'pdf/lib/links';
import { content, pageStyle } from 'pdf/styles';

class WeekOverviewPage extends React.Component {
	styles = StyleSheet.create(
		Object.assign(
			{
				days: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					flexGrow: 1,
					paddingTop: 1,
					paddingLeft: 1,
				},
				day: {
					width: '33.5%',
					height: '33.5%',
					border: '1 solid black',
					flexDirection: 'column',
					marginTop: -1,
					marginLeft: -1,
					padding: 5,
					textDecoration: 'none',
					color: 'black',
				},
				dayDate: {
					flexDirection: 'row',
					flexGrow: 1,
					marginBottom: 2,
				},
				dayOfWeek: {
					fontSize: 12,
					fontWeight: 'bold',
				},
				shortDate: {
					fontSize: 12,
					textTransform: 'uppercase',
					marginLeft: 'auto',
				},
				todos: {
					width: '66.6%',
					height: '33.5%',
					flexDirection: 'column',
					padding: 5,
				},
				todo: {
					fontSize: 10,
				},
				todotable: {
					width: '66.6%',
					height: '33.5%',
					flexDirection: 'column',
				},
				todotableRow: {
					border: '1 solid black',
					borderRight: 'none',
					marginTop: -1,
					marginLeft: -1,
					textDecoration: 'none',
					color: 'black',
					fontSize: 10,
					display: 'flex',
					flexDirection: 'row',
				},
				todotableColumn: {
					flexGrow: 1,
					flexShrink: 1,
					textDecoration: 'none',
					color: '#cccccc',
					fontWeight: 'normal',
					textAlign: 'center',
					padding: '2',
					borderRight: '1 solid black',
				},
				todotableColumnLabel: {
					width: '50%',
					textDecoration: 'none',
					color: 'black',
					fontWeight: 'normal',
					textAlign: 'center',
					padding: '2',
					borderRight: '1 solid black',
				},
				todotableColumnTitle: {
					flexGrow: 1,
					flexShrink: 1,
					textDecoration: 'none',
					color: 'black',
					fontWeight: 'bold',
					textAlign: 'center',
					padding: '2',
					borderRight: '1 solid black',
				},
				todotableColumnTitleLabel: {
					width: '50%',
					textDecoration: 'none',
					color: 'black',
					fontWeight: 'bold',
					textAlign: 'left',
					padding: '2',
					borderRight: '1 solid black',
				},
				specialItem: {
					fontSize: 10,
				},
			},
			{ content, page: pageStyle( this.props.config ) },
		),
	);

	getNameOfWeek() {
		const { date } = this.props;
		const beginningOfWeek = date.startOf( 'week' ).format( 'DD MMMM' );
		const endOfWeek = date.endOf( 'week' ).format( 'DD MMMM' );
		return `${beginningOfWeek} - ${endOfWeek}`;
	}

	renderDays() {
		const { date } = this.props;
		let currentDate = date.startOf( 'week' );
		const endOfWeek = date.endOf( 'week' );
		const days = [];
		while ( currentDate.isBefore( endOfWeek ) ) {
			days.push( this.renderDay( currentDate ) );
			currentDate = currentDate.add( 1, 'day' );
		}

		days.push( this.renderTodos() );

		return days;
	}

	renderDay( day ) {
		const { config } = this.props;
		const specialDateKey = day.format( SPECIAL_DATES_DATE_FORMAT );
		const specialItems = config.specialDates.filter( findByDate( specialDateKey ) );
		return (
			<Link
				key={ day.unix() }
				style={ this.styles.day }
				src={ '#' + dayPageLink( day, config ) }
			>
				<View style={ { flexDirection: 'column' } }>
					<View style={ this.styles.dayDate }>
						<Text style={ this.styles.dayOfWeek }>{day.format( 'dddd' )}</Text>
						<Text style={ this.styles.shortDate }>{day.format( 'DD MMM' )}</Text>
					</View>
					{specialItems.map( ( { id, type, value } ) => (
						<Text
							key={ id }
							style={ [
								this.styles.specialItem,
								{ fontWeight: type === HOLIDAY_DAY_TYPE ? 'bold' : 'normal' },
							] }
						>
							» {value}
						</Text>
					) )}
				</View>
			</Link>
		);
	}

	renderTodos() {
		return (
			<View key={ 'todos' } style={ this.styles.todotable }>
				<View style={ this.styles.todotableRow }>
					<Text style={ this.styles.todotableColumnTitleLabel }>To Do</Text>
					<Text style={ this.styles.todotableColumnTitle }>Su</Text>
					<Text style={ this.styles.todotableColumnTitle }>Mo</Text>
					<Text style={ this.styles.todotableColumnTitle }>Tu</Text>
					<Text style={ this.styles.todotableColumnTitle }>We</Text>
					<Text style={ this.styles.todotableColumnTitle }>Th</Text>
					<Text style={ this.styles.todotableColumnTitle }>Fr</Text>
					<Text style={ this.styles.todotableColumnTitle }>Sa</Text>
				</View>
				{[ 0, 1, 2, 3, 4, 5, 6, 7, 8 ].map( ( { id, value } ) => (
					<View key={ id } style={ this.styles.todotableRow }>
						<View style={ this.styles.todotableColumnLabel }></View>
						<Text style={ this.styles.todotableColumn }>Su</Text>
						<Text style={ this.styles.todotableColumn }>Mo</Text>
						<Text style={ this.styles.todotableColumn }>Tu</Text>
						<Text style={ this.styles.todotableColumn }>We</Text>
						<Text style={ this.styles.todotableColumn }>Th</Text>
						<Text style={ this.styles.todotableColumn }>Fr</Text>
						<Text style={ this.styles.todotableColumn }>Sa</Text>
					</View>
				) )}
				{this.props.config.todos.map( ( { id, value } ) => (
					<Text key={ id } style={ this.styles.todo }>
						{value}
					</Text>
				) )}
			</View>
		);
	}

	render() {
		const { t, date, config } = this.props;
		return (
			<Page id={ weekOverviewLink( date, config ) } size={ config.pageSize }>
				<View style={ this.styles.page }>
					<Header
						isLeftHanded={ config.isLeftHanded }
						title={ t( 'page.week.title' ) }
						subtitle={ this.getNameOfWeek() }
						number={ getWeekNumber( date ).toString() }
						previousLink={
							'#' + weekOverviewLink( date.subtract( 1, 'week' ), config )
						}
						nextLink={ '#' + weekOverviewLink( date.add( 1, 'week' ), config ) }
						calendar={
							<MiniCalendar
								date={ date }
								highlightMode={ HIGHLIGHT_WEEK }
								config={ config }
							/>
						}
					/>
					<View style={ this.styles.days }>{this.renderDays()}</View>
				</View>
			</Page>
		);
	}
}

WeekOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( WeekOverviewPage );
