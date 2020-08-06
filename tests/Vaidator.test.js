import Validator from '../src/Validator';

let errors;

describe('Validator', () => {
    beforeEach(() => {
        errors = Validator;
    });
    afterEach(() => {
        errors.clear();
    });

    it('can determine if there are any errors', () => {
        expect(errors.any()).toBe(false);
        errors.fill({ first_name: ['Value is required'] });
        expect(errors.any()).toBe(true);
    });

    it('can determine if a given field or object has any errors', () => {
        expect(errors.any()).toBe(false);

        errors.fill({
            first_name: ['Value is required'],
            'person.0.first_name': ['Value is required'],
        });

        expect(errors.has('first')).toBe(false);
        expect(errors.has('first_name')).toBe(true);
        expect(errors.has('person')).toBe(true);
    });

    it('can get all errors', () => {
        const allErrors = { first_name: ['Value is required'] };

        errors.fill(allErrors);

        expect(errors.all()).toEqual(allErrors);
    });

    it('can get a specific error', () => {
        expect(errors.any()).toBe(false);

        errors.fill({ first_name: ['Value is required'] });

        expect(errors.first('first_name')).toEqual('Value is required');

        expect(errors.first('last_name')).toBeUndefined();
    });

    it('can clear all the errors', () => {
        errors.fill({
            first_name: ['Value is required'],
            last_name: ['Value is required'],
        });

        expect(errors.any()).toBe(true);

        errors.clear();

        expect(errors.any()).toBe(false);
    });

    it('can clear a specific error', () => {
        errors.fill({
            first_name: ['Value is required'],
            last_name: ['Value is required'],
        });

        errors.clear('first_name');

        expect(errors.has('first_name')).toBe(false);
        expect(errors.has('last_name')).toBe(true);
    });

    it('can clear all errors of a given object', () => {
        errors.fill({
            'person.first_name': ['Value is required'],
            'person.last_name': ['Value is required'],
            'dates.0.start_date': ['Value is required'],
            'dates.1.start_date': ['Value is required'],
            'roles[0].name': ['Value is required'],
            'roles[1].name': ['Value is required'],
        });

        errors.clear('person');
        errors.clear('dates.0');
        errors.clear('roles[1]');

        expect(errors.has('person')).toBe(false);
        expect(errors.has('person.first_name')).toBe(false);
        expect(errors.has('person.last_name')).toBe(false);

        expect(errors.has('dates')).toBe(true);
        expect(errors.has('dates.0.start_date')).toBe(false);
        expect(errors.has('dates.1.start_date')).toBe(true);

        expect(errors.has('roles')).toBe(true);
        expect(errors.has('roles[0].name')).toBe(true);
        expect(errors.has('roles[1].name')).toBe(false);
    });

    it('can accept an object of errors in its constructor', () => {
        errors.fill({
            first_name: ['Value is required'],
        });

        expect(errors.first('first_name')).toEqual('Value is required');
    });

    it('can assign an empty object in its constructor if no errors are passed', () => {
        expect(errors.all()).toEqual({});
    });
});
