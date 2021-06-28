/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { getChartMetadataRegistry, ChartMetadata } from '@superset-ui/core';
import { render, screen } from 'spec/helpers/testing-library';
import VizTypeControl from 'src/explore/components/controls/VizTypeControl';
import { DynamicPluginProvider } from 'src/components/DynamicPlugins';
import { act } from 'react-dom/test-utils';

const defaultProps = {
  name: 'viz_type',
  label: 'Visualization Type',
  value: 'vis1',
  onChange: sinon.spy(),
  isModalOpenInit: true,
};

const waitForEffects = () =>
  act(() => new Promise(resolve => setTimeout(resolve, 0)));

describe('VizTypeControl', () => {
  const registry = getChartMetadataRegistry();
  registry
    .registerValue(
      'vis1',
      new ChartMetadata({
        name: 'vis1',
        thumbnail: '',
      }),
    )
    .registerValue(
      'vis2',
      new ChartMetadata({
        name: 'vis2',
        thumbnail: '',
      }),
    );

  beforeEach(async () => {
    render(
      <DynamicPluginProvider>
        <VizTypeControl {...defaultProps} />
      </DynamicPluginProvider>,
    );
    await waitForEffects();
  });

  it('calls onChange when submitted', () => {
    const thumbnail = screen.getAllByTestId('viztype-selector-container')[0];
    const submit = screen.getByText('Select');
    userEvent.click(thumbnail);
    expect(defaultProps.onChange.called).toBe(false);
    userEvent.click(submit);
    expect(defaultProps.onChange.called).toBe(true);
  });

  it('filters images based on text input', async () => {
    const thumbnails = screen.getAllByTestId('viztype-selector-container');
    expect(thumbnails).toHaveLength(2);

    const searchInput = screen.getByPlaceholderText('Search');
    userEvent.type(searchInput, '2');
    await waitForEffects();

    const thumbnail = screen.getByTestId('viztype-selector-container');
    expect(thumbnail).toBeInTheDocument();
  });
});
