import React, { useState, useEffect } from 'react';
import Engine from '../models/engine';
import './input.css';

const AccountInput = ({ onSelect, engineEntity }) => {
    const [engine, setEngine] = useState(engineEntity || new Engine());

    useEffect(() => {
        if (!engineEntity) {
            const newEngine = new Engine();
            newEngine.loadTemplateAccounts("template-accounts");
            setEngine(newEngine);
        }
    }, [engineEntity]);

    const [query, setQuery] = useState('');
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        const accounts = engine.accounts || [];
        const filtered = accounts.filter(account => 
            account.name.toLowerCase().includes(query.toLowerCase()) ||
            account.aliases.some(alias => alias.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredAccounts(filtered);
    }, [query, engine]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, filteredAccounts.length - 1));
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (selectedIndex >= 0 && selectedIndex < filteredAccounts.length) {
                handleSelect(filteredAccounts[selectedIndex]);
                e.preventDefault();
            }
        }
    };

    const handleSelect = (account) => {
        setQuery(account.name);
        setFilteredAccounts([]);
        onSelect(account);
    };

    return (
        <div className="account-input">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter account name or alias"
            />
            {filteredAccounts.length > 0 && (
                <ul className="account-options">
                    {filteredAccounts.map((account, index) => (
                        <li
                            key={account.code}
                            className={index === selectedIndex ? 'selected' : ''}
                            onClick={() => handleSelect(account)}
                        >
                            <span className="account-name">{account.name}</span>
                            <span className="account-code">{account.code}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AccountInput;