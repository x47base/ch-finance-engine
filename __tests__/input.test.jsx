import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AccountInput from '../src/ui/input';
import Engine from '../src/models/engine';

jest.mock('../src/models/engine');

describe('AccountInput Component', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
        engine.accounts = [
            { code: 1000, name: 'Bank', aliases: ['BankKonto'] },
            { code: 2000, name: 'Verbindlichkeiten L+L', aliases: ['Kreditoren'] },
            { code: 1100, name: 'Immobilien', aliases: [] },
        ];
        Engine.mockImplementation(() => engine);
    });

    test('renders input box and suggestions', () => {
        render(<AccountInput onSelect={jest.fn()} />);

        const input = screen.getByPlaceholderText('Enter account name or alias');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'Bank' } });
        const suggestions = screen.getAllByRole('listitem');
        expect(suggestions).toHaveLength(1);
        expect(suggestions[0]).toHaveTextContent('Bank');
        expect(suggestions[0]).toHaveTextContent('1000');
    });

    test('selects an account from suggestions', () => {
        const handleSelect = jest.fn();
        render(<AccountInput onSelect={handleSelect} />);

        const input = screen.getByPlaceholderText('Enter account name or alias');
        fireEvent.change(input, { target: { value: 'Verbindlichkeiten' } });

        const suggestion = screen.getByText('Verbindlichkeiten L+L');
        fireEvent.click(suggestion);

        expect(handleSelect).toHaveBeenCalledWith({
            code: 2000,
            name: 'Verbindlichkeiten L+L',
            aliases: ['Kreditoren'],
        });
        expect(input).toHaveValue('Verbindlichkeiten L+L');
    });

    test('navigates suggestions with keyboard', () => {
        render(<AccountInput onSelect={jest.fn()} />);

        const input = screen.getByPlaceholderText('Enter account name or alias');
        fireEvent.change(input, { target: { value: 'i' } });

        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(input).toHaveValue('Immobilien');
    });
});