import Validator from '../src/Validator'
import { sleep } from '../src/util'

describe('Validator', () => {
    let validator
    beforeEach(() => {
        validator = Validator
        validator.flush()
    })
    afterEach(() => {
        validator.flush()
    })
    test('Add an error', () => {
        validator.add('name', 'The name field is required.')
        expect(validator.any()).toBeTruthy()
    })
    test('add error with missed attribute', () => {
        validator.add('name-3diidi', 'The name field is required.')
        expect(validator.any()).toBeTruthy()
    })
    test('Add an error message as string', async () => {
        const errors = {
            name: 'The name field is required.',
        }
        validator.fill(errors)
        await sleep(100)
        expect(validator.any()).toBeTruthy()
        expect(validator.first('name')).toEqual('The name field is required.')
    })
    test('Check if error has "name" key.', () => {
        validator.add('name', 'The name field is required.')
        expect(validator.has('name')).toBeTruthy()
        expect(validator.first(['name', 'form.name'])).toBe(
            'The name field is required.',
        )
    })
    test('Check if has error by multi key', () => {
        validator.add('name', 'The name field is required.')
        validator.add('email', 'The email field is required.')
        expect(validator.has(['name', 'email'])).toBeTruthy()
        expect(validator.first('name')).toBe('The name field is required.')
    })
    test('Check if error has no "name" key', () => {
        validator.add('email', 'The email field is required.')
        expect(validator.missed('name')).toBeTruthy()
        expect(validator.nullState('name')).toBeNull()
    })
    test('Check nullState function', () => {
        validator.add('email', 'The email field is required.')
        expect(validator.nullState('email')).toBeFalsy()
    })
    test('Get an none exist error messages by param name', () => {
        expect(validator.get('email')).toHaveLength(0)
    })
    test('Get all errors by key', () => {
        validator.add('email', 'The email field is required.')
        expect(validator.get('email').length).toBeGreaterThan(0)
    })
    test('Get all errors by keys', () => {
        validator.add('email', 'The email field is required.')
        validator.add('form.email', 'The form.name field is required.')
        expect(validator.first(['name', 'form.email']).length).toBeGreaterThan(0)
    })
    test('Get all errors message', () => {
        validator.add('email', 'The email field is required.')
        validator.add('name', 'The name field is required.')
        expect(Object.keys(validator.all()).length).toBeGreaterThan(0)
    })
    test('Fill errors', () => {
        const errors = {
            name: ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        expect(validator.first('name')).toBe('The name field is required.')
        expect(validator.first('email')).toBe('The email field is required.')
        expect(Object.keys(validator.all()).length).toEqual(2)
    })
    it('should not allow protopath overwrite', () => {
        const errors = {
            __proto__: ['Set __proto__ to overwrite.'],
        }
        validator.fill(errors)
        expect(Object.keys(validator.all()).length).toEqual(0)
    })
    test('Clear all errors by flush', () => {
        const errors = {
            name: ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        validator.flush()
        expect(Object.keys(validator.all()).length).toEqual(0)
    })
    test('Clear all errors by clear', () => {
        const errors = {
            name: ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        validator.clear()
        expect(Object.keys(validator.all()).length).toEqual(0)
    })
    test('Clear all errors by key', () => {
        const errors = {
            name: ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        validator.clear('name')
        expect(validator.has('name')).toBeFalsy()
    })
    test('Check if there is no any errors', () => {
        const errors = {
            name: ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        validator.clear(['name', 'email'])
        expect(validator.isValid()).toBeTruthy()
    })
    test('Validate on nested array object', () => {
        validator.add(
            'contacts.0.phone_number',
            'The contacts 0 phone number field is required.',
        )
        expect(validator.has('contacts.0.phone_number')).toBeTruthy()
    })
    test('onkeydown event', () => {
        const event = {
            target: { name: 'name' },
        }
        const errors = {
            name: ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        validator.onKeydown(event)
        expect(validator.has('name')).toBeFalsy()
    })
    test('onkeydown event with name undefined', () => {
        const event = {
            target: { name: undefined },
        }
        const errors = {
            name: ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        validator.onKeydown(event)
        expect(validator.has('name')).toBeTruthy()
    })
    test('onkeydown event with prefix', () => {
        const event = {
            target: { name: 'name' },
        }
        const errors = {
            'form.name': ['The name field is required.'],
            email: ['The email field is required.'],
        }
        validator.fill(errors)
        validator.onKeydown(event, 'form')
        expect(validator.has(['form.name'])).toBeFalsy()
    })

    it('can pass array of keys to any method and get back error of specified key', () => {
        const errors = {
            first_name: ['This field is required'],
            last_name: ['This field is required'],
            age: ['This field is required'],
        }
        validator.fill(errors)

        expect(validator.any(['first_name', 'last_name'], true)).toEqual({
            first_name: ['This field is required'],
            last_name: ['This field is required'],
        })
    })

    it('should return empty object, with returnObject property is true', () => {
        const errors = {
            first_name: ['This field is required'],
            last_name: ['This field is required'],
            age: ['This field is required'],
        }
        validator.fill(errors)
        expect(validator.any([], true)).toEqual({})
    })

    it('can pass array of keys to any method and get back boolean', () => {
        const errors = {
            first_name: ['This field is required'],
            last_name: ['This field is required'],
            age: ['This field is required'],
        }
        validator.fill(errors)

        expect(validator.any(['first_name', 'last_name'], false)).toBeTruthy()
    })
})
