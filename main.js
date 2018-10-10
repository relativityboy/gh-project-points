// ==UserScript==
// @name         Calc Points!
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Calculate the points in each column
// @author       relativityboy
// @match        https://github.com/orgs/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const rPointLabel = /^([0-9])+( - ([0-9]|[A-z])+)?$/;
    const POINT_LABEL_SEPARATOR = ' - ';
    const GENERIC_GROUP = '_generic';
    const EL_ATR_LABEL = 'aria-label';
    const EL_ATR_HREF = 'href';
    const EL_ATR_DATA_CARD_TYPE = 'data-card-type';
    const EL_CLASS_ISSUE_HREF = 'js-project-card-issue-link';
    const TYPE_BUG = 'bug';
    const TYPE_SPIKE = 'spike';
    const TYPE_STORY = 'story';
    const rBugLabel = /^bug$/
    const rSpikeLabel = /^spike$/
    const rIsIssue = /^\["issue"\]$/;

    const toArray = htmlCollection => [].slice.call(htmlCollection);

    const pointsByColumn = {};

    class GroupPointColumn {
        constructor(groupName, title) {
            this.points = {
                bug:0,
                story:0,
                spike:0
            };

            this.groupName = groupName;
            this.title = '';
            this.issues = [];
        }

        addIssue(newIssue) {
            if(newIssue.title !== '') {
                if(this.title == '') {
                    this.title = newIssue.title;
                } else if(this.title !== newIssue.title) {
                    console.log(`Encountered inconsistent point titling for label on issue ${newIssue.href}. "${newIssue.title}" != "${this.title}"`)
                }
            }
            this.points[newIssue.type] += newIssue.points;
            this.issues.push(newIssue);
        }

        get bugPoints() {
            return this.points.bug;
        }

        get storyPoints() {
            return this.points.story;
        }

        get spikePoints() {
            return this.points.spike;
        }

        get totalPoints() {
            return this.points.bug + this.points.story + this.points.spike;
        }
    }


    function parsePointsFromIssueElement(issueEl) {
        const href = issueEl.getElementsByClassName(EL_CLASS_ISSUE_HREF)[0].getAttribute(EL_ATR_HREF);
        const perGroupData = [];
        const pointList = [];

        let pointsFound = false;
        let issueType = TYPE_STORY;


        const labelContainer = issueEl.getElementsByClassName('labels');
        if(labelContainer.length > 0) {
            const labels = toArray(labelContainer[0].getElementsByTagName('button'))

            labels.map(label => {
                const innerText = label.innerText;
                if(rPointLabel.exec(innerText)) {
                    pointsFound = true;
                    const points = parseInt(innerText.split(POINT_LABEL_SEPARATOR)[0]);
                    const group = innerText.split(POINT_LABEL_SEPARATOR)[1] || GENERIC_GROUP;
                    perGroupData.push({group, points, title:(label.getAttribute(EL_ATR_LABEL) || '')});

                } else if(rBugLabel.exec(innerText)) {
                    issueType = TYPE_BUG;
                } else if(rSpikeLabel.exec(innerText)) {
                    issueType = TYPE_SPIKE;
                }
            });
        }
        if(pointsFound) {
            perGroupData.map(groupData => {
                pointList.push({
                    href,
                    points:groupData.points,
                    group:groupData.group,
                    title:groupData.title,
                    type:issueType
                });
            });
        }

        return pointList;
    }

    function calculatePointsFromColumnElement(columnEl) {
        const pointsByGroup = {};

        const issues = toArray(columnEl.getElementsByClassName('js-project-column-card'));
        issues.map(issueEl => {
            if(rIsIssue.exec(issueEl.getAttribute(EL_ATR_DATA_CARD_TYPE))) {
                const pointList = parsePointsFromIssueElement(issueEl);
                pointList.map(issueData => {
                    if (!pointsByGroup[issueData.group]) {
                        pointsByGroup[issueData.group] = new GroupPointColumn(issueData.group, issueData.title);
                    }
                    pointsByGroup[issueData.group].addIssue(issueData)
                });
            }
        });
        return pointsByGroup;
    }

    function runCalcPoints() {

        const columns = toArray(window.document.getElementsByClassName('project-column'));

        const columnDataMatrix = {};

        columns.map(column => {
            const colName = column.getElementsByClassName('js-project-column-name')[0].innerHTML;

            if(column.firstElementChild.getElementsByClassName('js-points-container').length == 0) {
                column.firstElementChild.innerHTML += `<div class="js-points-container hide-sm position-relative p-sm-2">wait</div>`
            }

            const colHeader = column.firstElementChild.getElementsByTagName('h4')[0];
            const pointsByGroup = calculatePointsFromColumnElement(document.getElementById('column-cards-' + column.dataset.id));

            let pointsHTML = ''

            Object.values(pointsByGroup).map(groupPoints => {
                if(groupPoints.totalPoints > 0) {
                    const groupName = (groupPoints.groupName != GENERIC_GROUP)? groupPoints.groupName + ' - ' : '';
                    pointsHTML += `<span class="Counter Counter--gray-dark mr-1 position-relative js-column-card-count" title="${groupPoints.title} total/story/spike/bug">${groupName}${groupPoints.totalPoints} - ${groupPoints.storyPoints} / ${groupPoints.spikePoints} / ${groupPoints.bugPoints}</span>`;
                }
            });

            const pointsContainer = column.firstElementChild.getElementsByClassName('js-points-container')[0];

            if(pointsContainer.innerHTML != pointsHTML) {
                pointsContainer.innerHTML = pointsHTML;
            }

            columnDataMatrix[column.dataset.id] = {
                name:colName,
                column,
                pointsByGroup
            }

        });
        window.columnDataMatrix = columnDataMatrix
        setTimeout(runCalcPoints, 5000);

        return true;

    }
    runCalcPoints();
    console.log('calcPoints running. Data available in window.columnDataMatrix: ', window.columnDataMatrix);

})();
