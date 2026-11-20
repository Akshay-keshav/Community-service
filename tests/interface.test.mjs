import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { JSDOM } from 'jsdom'

for (const width of [390, 1366]) test(`directory UX at ${width}px (DOM): home search, removable filters, relevant progress and match groups`, async () => {
 const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost:5173', runScripts: 'outside-only', pretendToBeVisual: true })
 const w = dom.window, d = w.document
 Object.defineProperty(w, 'innerWidth', { value: width })
 w.scrollTo = () => {}
 const bundle = readdirSync(new URL('../dist/assets/', import.meta.url)).find(f => f.endsWith('.js'))
 w.eval(readFileSync(new URL('../dist/assets/' + bundle, import.meta.url), 'utf8'))
 const settle = () => new Promise(r => setTimeout(r, 30))
 const click = async label => {
  const el = [...d.querySelectorAll('button')].find(b => b.textContent.includes(label))
  assert.ok(el, label); el.click(); await settle()
 }
 const fill = async (el, value) => {
  Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value').set.call(el, value)
  el.dispatchEvent(new w.Event('input', { bubbles: true })); await settle()
 }
 const choose = async (name, value) => { d.querySelector(`input[name="${name}"][value="${value}"]`).click(); await settle() }
 const category = async label => {
  const editor = d.querySelector('.category-editor')
  if (!editor.open) { editor.querySelector('summary').click(); await settle() }
  const input = [...editor.querySelectorAll('label')].find(el => el.textContent === label)?.querySelector('input')
  assert.ok(input, label); input.click(); await settle()
 }
 try {
  await settle()
  assert.equal(d.querySelector('header nav button:last-child').textContent, 'Find Schemes for Me', 'no premature Results destination')
  await fill(d.getElementById('home-query'), 'गैस')
  d.querySelector('.home-search').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); await settle()
  assert.equal(d.querySelector('input[type="search"]').value, 'गैस')
  assert.equal(d.querySelectorAll('.scheme-card').length, 1)
  assert.equal(d.querySelector('.scheme-card').dataset.schemeId, 'pmuy')
  assert.equal(d.querySelectorAll('.scheme-card a.official-action').length, 3, 'all provider choices remain direct links')
  await click('English')
  assert.equal(d.querySelector('input[type="search"]').value, 'गैस')
  assert.equal(d.querySelectorAll('.scheme-card').length, 1)
  d.querySelector('.active-filters button').click(); await settle()
  assert.equal(d.querySelector('input[type="search"]').value, '')
  assert.equal(d.querySelectorAll('.scheme-card').length, 20)
  await click('English'); await click('Find Schemes for Me')
  await category('Education & Scholarships'); await category('Agriculture')
  assert.equal(d.querySelector('input[name="level"]'), null)
  assert.equal(d.querySelector('.form-heading .eyebrow').textContent.replace(/\s/g, ''), 'Step1/1')
  assert.equal(d.querySelector('progress').value, 0)
  assert.equal(d.querySelector('progress').max, 3)
  await choose('farmerLand', 'yes'); await choose('kisanExcluded', 'no')
  assert.equal(d.querySelector('progress').value, 2)
  await click('See my results')
  assert.equal(d.querySelectorAll('.scheme-card').length, 2)
  const group = status => d.querySelector(`.result-counts .${status}`)
  group('likely').click(); await settle()
  assert.equal(d.querySelectorAll('.scheme-card').length, 1)
  assert.equal(d.querySelector('.scheme-card').dataset.schemeId, 'pmkisan')
  assert.equal(group('likely').getAttribute('aria-pressed'), 'true')
  await click('English')
  assert.equal(group('likely').getAttribute('aria-pressed'), 'true')
  assert.equal(d.querySelectorAll('.scheme-card').length, 1)
  await click('English')
  group('fail').click(); await settle()
  assert.equal(d.querySelectorAll('.scheme-card').length, 0)
  await click('Show all results')
  assert.equal(d.querySelectorAll('.scheme-card').length, 2)
  await click('Edit my answers')
  assert.ok(d.querySelector('input[name="farmerLand"][value="yes"]').checked)
  assert.equal(d.querySelector('progress').value, 2)
 } finally { dom.window.close() }
})
