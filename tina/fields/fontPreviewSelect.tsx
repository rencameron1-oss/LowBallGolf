import React from 'react';
import type { FieldPlugin, InputFieldType } from 'tinacms';
import { BaseTextField, wrapFieldsWithMeta } from 'tinacms';
import { buildGoogleFontStylesheetUrl, googleFontCatalog, googleFontKeys, type GoogleFontKey } from '../../src/config/brand';

const fontPreviewStylesheetUrl = buildGoogleFontStylesheetUrl(googleFontKeys);
const previewSampleText = 'Your Brand';

const ensureFontPreviewStyles = () => {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById('tina-font-preview-stylesheet')) {
    return;
  }

  const link = document.createElement('link');
  link.id = 'tina-font-preview-stylesheet';
  link.rel = 'stylesheet';
  link.href = fontPreviewStylesheetUrl;
  document.head.appendChild(link);
};

type FontOption = {
  value: string;
  label: string;
};

const normalizeOptions = (options: (FontOption | string)[] = []): FontOption[] =>
  options.map((option) =>
    typeof option === 'string'
      ? { value: option, label: googleFontCatalog[option as GoogleFontKey]?.label || option }
      : option
  );

const CATEGORY_FILTERS = ['All', 'Serif', 'Sans', 'Display', 'Mono', 'Script'] as const;

const FontPreviewSelector = ({ input, field }: InputFieldType<{}, {}>) => {
  const [query, setQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  React.useEffect(() => {
    ensureFontPreviewStyles();
  }, []);

  const options = React.useMemo(() => {
    const fieldOpts = normalizeOptions(field.options);
    if (fieldOpts.length > 0) return fieldOpts;
    return googleFontKeys.map((key) => ({
      value: key,
      label: `${googleFontCatalog[key].label} (${googleFontCatalog[key].category})`,
    }));
  }, [field.options]);
  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return options.filter((option) => {
      const font = googleFontCatalog[option.value as GoogleFontKey];
      // Category filter
      if (activeCategory !== 'All' && font?.category !== activeCategory) {
        return false;
      }
      // Text search
      if (!normalizedQuery) return true;
      return (
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.value.toLowerCase().includes(normalizedQuery) ||
        font?.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [options, query, activeCategory]);

  const selectedValue =
    typeof input.value === 'string' ? input.value : options[0] ? options[0].value : '';
  const selectedFont = googleFontCatalog[selectedValue as GoogleFontKey];
  const selectedOption =
    options.find((option) => option.value === selectedValue) || {
      value: selectedValue,
      label: selectedFont?.label || 'Use selected font pairing',
    };

  return (
    <div className="space-y-3">
      <div
        className="rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm"
        style={{ fontFamily: selectedFont?.family || 'system-ui, sans-serif' }}
      >
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Selected Font Preview
        </div>
        <div className="mt-2 text-3xl text-gray-900">
          {previewSampleText}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Current font:
          {' '}
          <span className="font-semibold text-gray-800">{selectedOption.label}</span>
          . Click another font card below, then save the page.
        </div>
      </div>

      <label style={{ display: 'block' }}>
        <div
          style={{
            marginBottom: '6px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#6b7280',
          }}
        >
          Quick Select
        </div>
        <select
          value={selectedValue}
          onChange={(event) => {
            input.onChange(event.target.value);
            input.onBlur?.();
          }}
          style={{
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            backgroundColor: '#fff',
            padding: '10px 12px',
            fontSize: '14px',
            color: '#111827',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {/* Category filter tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              borderRadius: '9999px',
              border: activeCategory === cat ? '1px solid #3b82f6' : '1px solid #e5e7eb',
              backgroundColor: activeCategory === cat ? '#eff6ff' : '#fff',
              color: activeCategory === cat ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <BaseTextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search preview fonts"
      />

      <div
        style={{
          maxHeight: '420px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb',
          padding: '8px',
        }}
      >
        {filteredOptions.map((option) => {
          const font = googleFontCatalog[option.value as GoogleFontKey];
          const isSelected = option.value === selectedValue;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                input.onChange(option.value);
                input.onBlur?.();
              }}
              aria-pressed={isSelected}
              title={
                isSelected
                  ? `${font?.label || option.label} is currently selected`
                  : `Use ${font?.label || option.label}`
              }
              style={{
                width: '100%',
                borderRadius: '6px',
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                padding: '12px',
                textAlign: 'left' as const,
                cursor: 'pointer',
                backgroundColor: isSelected ? '#eff6ff' : '#fff',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>{font?.label || option.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.14em', color: '#6b7280' }}>
                    {font?.category || 'Font'}
                  </div>
                  <div
                    style={{
                      borderRadius: '9999px',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.16em',
                      backgroundColor: isSelected ? '#2563eb' : '#e5e7eb',
                      color: isSelected ? '#fff' : '#4b5563',
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '24px', color: '#111827', fontFamily: font?.family }}>
                {previewSampleText}
              </div>
            </button>
          );
        })}

        {filteredOptions.length === 0 && (
          <div style={{ borderRadius: '6px', border: '1px dashed #d1d5db', backgroundColor: '#fff', padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
            No fonts matched that search.
          </div>
        )}
      </div>
    </div>
  );
};

export const fontPreviewFieldPlugin: FieldPlugin = {
  __type: 'field',
  name: 'fontPreviewSelect',
  Component: wrapFieldsWithMeta(FontPreviewSelector),
  parse: (value) => value || '',
};
